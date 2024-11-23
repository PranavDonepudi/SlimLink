from google.cloud import bigtable
from google.cloud.bigtable import column_family
import os

# # Set the path to your service account key
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "SlimLink/bigTable-key.json"

# Variables
project_id = "rice-comp-539-spring-2022"
instance_id = "comp-539-bigtable"
table_id = "SlimLink-URLs"

def create_bigtable_table():
    # Connect to Bigtable instance
    client = bigtable.Client(project=project_id, admin=True)
    instance = client.instance(instance_id)

    # Check if the table already exists
    table = instance.table(table_id)
    if table.exists():
        print(f"Table '{table_id}' already exists.")
        return

    # Create a new table
    print(f"Creating table '{table_id}'...")
    table.create()

    # Add column family
    column_family_id = "cf1"
    column_families = {column_family_id: column_family.MaxVersionsGCRule(1)}
    table.create(column_families=column_families)

    print(f"Table '{table_id}' created successfully with column family '{column_family_id}'.")

if __name__ == "__main__":
    create_bigtable_table()