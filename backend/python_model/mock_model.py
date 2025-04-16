import sys
import json

def mock_model(data):
    # Sum all numeric values
    total_sum = sum([
        data.get("airTemp", 0),
        data.get("airPercentHumidity", 0),
        data.get("soilTemp", 0),
        data.get("soilPercentHumidity", 0),
    ])
    return {"totalSum": total_sum}

if __name__ == "__main__":
    # Read JSON data from stdin
    input_data = json.loads(sys.stdin.read())
    result = mock_model(input_data)
    # Output the result as JSON
    print(json.dumps(result))
