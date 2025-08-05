from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from pyment_generator import SimplePaymentGenerator

class CreatePaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        item_name = request.data.get('item_name', 'TixGo訂單付款')
        amount = request.data.get('amount', 100)
        choose_payment = request.data.get('choose_payment', 'Credit')
        try:
            generator = SimplePaymentGenerator()
            form_html = generator.create_payment_page(
                item_name=item_name,
                amount=int(amount),
                choose_payment=choose_payment,
            )
            return Response({'form_html': form_html})
        except Exception as e:
            return Response({'error': f'付款頁面產生失敗：{str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
