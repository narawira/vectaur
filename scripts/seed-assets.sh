#!/bin/bash

# Path to the raw directory
raw_dir="raw"

# Path to the vectors.json file
vectors_file="data/vectors.json"

# Get the next id from the vectors.json file
next_id=$(jq -r '.[0].id + 1' "$vectors_file")

# Loop over each .png file in the raw directory
for file in $raw_dir/*.png; do
  # Ask the user for the caption, type, and tags
  read -p "Enter caption: " caption
  read -p "Enter type: " type
  read -p "Enter tags (comma-separated): " tags

  # Generate the id, svg, png, and created_at values
  id=$((next_id))
	uuid=$(uuidgen)
  order=0
  svg="/svg/$uuid.svg"
  png="/png/$uuid.png"
  created_at=$(date -u +"%Y-%m-%dT%H:%M:%S.000000Z")

  # Convert the comma-separated tags to a JSON array
  tags_json=$(jq -R -s -c 'split(",") | map(sub("^ *"; "") | sub(" *$"; ""))' <<< "$tags")

  # Create the new item as a JSON object
  new_item=$(jq -n \
                --argjson id "$id" \
                --argjson order "$order" \
                --arg svg "$svg" \
                --arg png "$png" \
                --arg caption "$caption" \
                --arg type "$type" \
                --arg created_at "$created_at" \
                --argjson tags "$tags_json" \
                '{id: $id, order: $order, svg: $svg, png: $png, caption: $caption, type: $type, created_at: $created_at, tags: $tags}')

  # Prepend the new item to the vectors.json file
  vectors=$(jq --argjson new_item "$new_item" '. | [$new_item] + .' "$vectors_file")
  echo "$vectors" > "$vectors_file"

  # Move and rename the .png file to the public/png directory
  mv "$file" "public$png"

  # Move and rename the corresponding .svg file to the public/svg directory
  mv "${file%.png}.svg" "public$svg"

  # Increment the next id
  next_id=$((next_id + 1))
done