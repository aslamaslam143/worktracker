import os
import json
from google.oauth2 import service_account
from googleapiclient.discovery import build
from tasks.models import Task
from .models import GoogleSheetsSyncLog

SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

def get_sheets_service():
    sa_json = os.getenv('GOOGLE_SERVICE_ACCOUNT_JSON')
    if not sa_json:
        return None, "GOOGLE_SERVICE_ACCOUNT_JSON environment variable not configured"

    try:
        if os.path.exists(sa_json):
            creds = service_account.Credentials.from_service_account_file(sa_json, scopes=SCOPES)
        else:
            info = json.loads(sa_json)
            creds = service_account.Credentials.from_service_account_info(info, scopes=SCOPES)
        service = build('sheets', 'v4', credentials=creds)
        return service, None
    except Exception as e:
        return None, str(e)

def sync_user_tasks_to_sheets(clerk_user_id):
    spreadsheet_id = os.getenv('GOOGLE_SHEETS_SPREADSHEET_ID')
    if not spreadsheet_id:
        return False, "GOOGLE_SHEETS_SPREADSHEET_ID not set"

    service, err = get_sheets_service()
    if err:
        return False, err

    try:
        sheet_metadata = service.spreadsheets().get(spreadsheetId=spreadsheet_id).execute()
        existing_sheets = [s['properties']['title'] for s in sheet_metadata.get('sheets', [])]

        tasks = Task.objects.filter(clerk_user_id=clerk_user_id)
        synced_count = 0

        # Group tasks by month tabs (e.g. "Oct 2026")
        tasks_by_month = {}
        for t in tasks:
            tab_name = t.work_date.strftime("%b %Y")
            tasks_by_month.setdefault(tab_name, []).append(t)

        for tab_name, month_tasks in tasks_by_month.items():
            if tab_name not in existing_sheets:
                # Add tab
                req = {'addSheet': {'properties': {'title': tab_name}}}
                service.spreadsheets().batchUpdate(
                    spreadsheetId=spreadsheet_id,
                    body={'requests': [req]}
                ).execute()
                existing_sheets.append(tab_name)
                # Write header
                header = [['Task ID', 'Work Date', 'Project', 'Title', 'Status', 'Priority', 'Hours Worked', 'Technologies', 'Description', 'Remarks']]
                service.spreadsheets().values().update(
                    spreadsheetId=spreadsheet_id,
                    range=f"'{tab_name}'!A1:J1",
                    valueInputOption='RAW',
                    body={'values': header}
                ).execute()

            # Read existing rows to avoid duplicates by Task ID
            res = service.spreadsheets().values().get(
                spreadsheetId=spreadsheet_id,
                range=f"'{tab_name}'!A:J"
            ).execute()
            rows = res.get('values', [])
            id_to_row_idx = {r[0]: idx + 1 for idx, r in enumerate(rows) if len(r) > 0}

            for t in month_tasks:
                task_id_str = str(t.id)
                row_data = [
                    task_id_str, str(t.work_date), t.project_name, t.title, t.status,
                    t.priority, float(t.hours_worked), t.technologies, t.description, t.remarks
                ]

                if task_id_str in id_to_row_idx:
                    row_idx = id_to_row_idx[task_id_str]
                    service.spreadsheets().values().update(
                        spreadsheetId=spreadsheet_id,
                        range=f"'{tab_name}'!A{row_idx}:J{row_idx}",
                        valueInputOption='RAW',
                        body={'values': [row_data]}
                    ).execute()
                else:
                    service.spreadsheets().values().append(
                        spreadsheetId=spreadsheet_id,
                        range=f"'{tab_name}'!A:J",
                        valueInputOption='RAW',
                        body={'values': [row_data]}
                    ).execute()

                GoogleSheetsSyncLog.objects.create(
                    clerk_user_id=clerk_user_id,
                    task=t,
                    status='SUCCESS',
                    sheet_name=tab_name
                )
                synced_count += 1

        return True, f"Successfully synced {synced_count} tasks"
    except Exception as e:
        GoogleSheetsSyncLog.objects.create(
            clerk_user_id=clerk_user_id,
            status='FAILED',
            sheet_name='Unknown',
            error_message=str(e)
        )
        return False, str(e)