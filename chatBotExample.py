#a  asssssssssesto es una pruebaimport requests
import json
#hola
# Configuración
API_KEY = "tu_clave_api_aquí"  # Reemplazar con tu clave API real
API_URL = "https://api.anthropic.com/v1/messages"
MODEL = "claude-3-7-sonnet-20250219"  # Puedes cambiar al modelo que prefieras

# Configuración de los headers
headers = {
    "x-api-key": API_KEY,
    "anthropic-version": "2023-06-01",
    "content-type": "application/json"
}

def get_claude_response(prompt, conversation_history=[]):
    """Obtiene una respuesta de Claude basada en el prompt y el historial de conversación."""
    
    # Construye el mensaje para la API
    messages = conversation_history + [{"role": "user", "content": prompt}]
    
    data = {
        "model": MODEL,
        "messages": messages,
        "max_tokens": 1000
    }
    
    # Realiza la solicitud a la API
    try:
        response = requests.post(API_URL, headers=headers, json=data)
        response.raise_for_status()  # Lanza excepción para errores HTTP
        
        result = response.json()
        return result["content"][0]["text"], "assistant"
    
    except requests.exceptions.RequestException as e:
        print(f"Error al comunicarse con la API: {e}")
        return "Lo siento, hubo un error al procesar tu solicitud.", "system"

def main():
    print("¡Bienvenido a tu Chatbot con Claude!")
    print("Escribe 'salir' para terminar la conversación.")
    print("-" * 50)
    
    conversation_history = []
    
    while True:
        user_input = input("\nTú: ")
        
        if user_input.lower() in ['salir', 'exit', 'quit']:
            print("\n¡Hasta luego!")
            break
        
        # Agrega el mensaje del usuario al historial
        conversation_history.append({"role": "user", "content": user_input})
        
        # Obtiene la respuesta de Claude
        print("\nClaude está pensando...")
        response, role = get_claude_response(user_input, conversation_history[:-1])
        
        # Agrega la respuesta de Claude al historial
        conversation_history.append({"role": role, "content": response})
        
        # Muestra la respuesta
        print(f"\nClaude: {response}")

if __name__ == "__main__":
    main()