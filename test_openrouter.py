
from engine.openrouter_client import OpenRouterClient

def main():
    client = OpenRouterClient()

    messages = [
        {"role": "system", "content": "You are Qwen, a helpful cloud AI assistant."},
        {"role": "user", "content": "Hello Qwen, briefly introduce yourself."},
    ]

    reply = client.chat(messages)
    print("Qwen says:\n")
    print(reply)


if __name__ == "__main__":
    main()
