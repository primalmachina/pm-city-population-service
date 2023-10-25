#!/bin/bash

output_file="output.txt"  # Name of the output file

# Empty the output file if it exists
> "$output_file"

# Loop through all files in the src/ directory and its subdirectories
while IFS= read -r file; do
    # Check if it's a regular file and not the output file
    if [[ "$file" != "./$output_file" && "$file" != "./src/$output_file" ]]; then
        # Print the file path
        echo "# $file" >> "$output_file"
        # Print the contents of the file
        cat "$file" >> "$output_file"
        # Add a newline for separation
        echo -e "\n" >> "$output_file"
    fi
done < <(find ./src -type f ! -name "$output_file")
