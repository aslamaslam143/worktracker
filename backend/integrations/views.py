import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from .google_sheets import get_sheets_service, sync_user_tasks_to_sheets
from .models import GoogleSheetsSyncLog

class GoogleSheetsStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        spreadsheet_id = os.getenv('GOOGLE_SHEETS_SPREADSHEET_ID')
        service, err = get_sheets_service()
        
        is_connected = False
        details = ""
        if not spreadsheet_id:
            details = "Spreadsheet ID is missing"
        elif err:
            details = err
        else:
            try:
                sheet = service.spreadsheets().get(spreadsheetId=spreadsheet_id).execute()
                is_connected = True
                details = f"Connected: '{sheet.get('properties', {}).get('title')}'"
            except Exception as e:
                details = str(e)

        last_sync = GoogleSheetsSyncLog.objects.filter(clerk_user_id=request.user.clerk_id).first()

        return Response({
            'connected': is_connected,
            'spreadsheet_id': spreadsheet_id or '',
            'message': details,
            'last_sync': {
                'status': last_sync.status if last_sync else None,
                'synced_at': last_sync.synced_at if last_sync else None,
                'error': last_sync.error_message if last_sync else None,
            } if last_sync else None
        })

class GoogleSheetsSyncView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        success, message = sync_user_tasks_to_sheets(request.user.clerk_id)
        if success:
            return Response({'status': 'success', 'message': message})
        return Response({'status': 'error', 'message': message}, status=status.HTTP_400_BAD_REQUEST)