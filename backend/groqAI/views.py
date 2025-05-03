from groq import Groq
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

client = Groq(api_key=settings.GROQ_API_KEY)

class GroqCompletionView(APIView):
    def post(self, request):
        prompt = request.data.get("prompt")
        if not prompt:
            return Response({"detail": "Prompt is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            response = client.chat.completions.create(
                model="llama3-70b-8192",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=100,
            )

            return Response({"response": response.choices[0].message.content})
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
