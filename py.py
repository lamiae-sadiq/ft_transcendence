# FOR TESTING PURPOSES !!!! 
# SCRIPT TO SEND TRANSACTION TO THE BLOCKCHAIN (CREATE TOURNAMENT AND RECORD MATCHES)

import requests
import json
from concurrent.futures import ThreadPoolExecutor, as_completed

# API endpoints
create_tournament_url = "http://localhost:8000/smartcontract/create-tournament/"
record_match_url = "http://localhost:8000/smartcontract/record-match/"

# Headers
headers = {"Content-Type": "application/json"}

# Number of tournaments/transactions to create
num_transactions = 1000

def send_record_match(tournament_id, match_index):
    """
    Function to send a record-match request.
    """
    match_data = {
        "tournament_id": tournament_id,
        "player1_name": f"Player{match_index}_A",
        "player2_name": f"Player{match_index}_B",
        "player1_score": match_index + 3,
        "player2_score": match_index + 1
    }
    try:
        response = requests.post(record_match_url, headers=headers, json=match_data)
        if response.status_code == 200:
            return f"Match {match_index} recorded for Tournament {tournament_id}: {response.json()}"
        else:
            return f"Failed to record match {match_index} for Tournament {tournament_id}: {response.status_code}, {response.text}"
    except Exception as e:
        return f"Error recording match {match_index} for Tournament {tournament_id}: {e}"

def send_transaction(i):
    """
    Function to create a tournament and send 3 record-match requests.
    """
    try:
        # Step 1: Create the tournament
        response = requests.post(create_tournament_url, headers=headers)
        if response.status_code == 200:
            tournament_data = response.json()
            tournament_id = tournament_data.get("tournament_id", i)  # Fallback ID
            
            results = [f"Transaction {i} successful: {tournament_data}"]
            
            # Step 2: Send 3 record-match requests
            for match_index in range(1, 4):  # Record 3 matches
                result = send_record_match(tournament_id, match_index)
                results.append(result)
            
            return "\n".join(results)
        else:
            return f"Transaction {i + 1} failed: {response.status_code}, {response.text}"
    except Exception as e:
        return f"Error with transaction {i + 1}: {e}"

# Main script to send requests concurrently
with ThreadPoolExecutor(max_workers=20) as executor:
    futures = [executor.submit(send_transaction, i) for i in range(num_transactions)]
    for future in as_completed(futures):
        print(future.result())
