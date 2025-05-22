#!/bin/bash

# Vérifie si un numéro de PR a été fourni
if [ -z "$1" ]; then
    echo "Usage: $0 <PR_NUMBER>"
    exit 1
fi

PR_NUMBER=$1
OUTPUT_FILE="reviews/pr_${PR_NUMBER}_review.json"

# Créer le dossier reviews s'il n'existe pas
mkdir -p reviews

echo "🔍 Sauvegarde de la review de la PR #${PR_NUMBER} dans ${OUTPUT_FILE}..."

# Sauvegarder les données de la PR
gh pr view $PR_NUMBER --json number,title,reviews,comments > "$OUTPUT_FILE"

echo "✅ Données sauvegardées dans $OUTPUT_FILE"
echo "📊 Résumé des commentaires :"
jq -r '.comments[] | select(.author.login == "coderabbitai") | .body' "$OUTPUT_FILE" | grep -E "^(🔭|🧹|⚠️|🛠️|📝)"

echo -e "\n📝 Pour voir le contenu complet :"
echo "cat $OUTPUT_FILE | jq ." 