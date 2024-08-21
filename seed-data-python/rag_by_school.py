import json
# Load the review data
data = json.load(open("data.json"))
YOUR_SCHOOL_NAME = "California State University San Bernardino"
JSON_FILE_NAME = "data_by_school_name.json"

filtered_data = []
for review in data:
    if review["school_name"] == YOUR_SCHOOL_NAME:
        filtered_data.append(
            {
                "school_name": review["school_name"],
                "professor_name": review["professor_name"],
                "department_name": review["department_name"],
                "star_rating": review["star_rating"],
                "comments": review["comments"]
            }
        )

# Append to the current array inside the data_by_school_name.json
with open(JSON_FILE_NAME, "r") as file:
    existing_data = json.load(file)
    existing_data.extend(filtered_data)

with open(JSON_FILE_NAME, "w") as file:
    json.dump(existing_data, file, indent=4)
