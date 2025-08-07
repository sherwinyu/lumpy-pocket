import csv
import json
from collections import Counter, defaultdict
from datetime import datetime
from urllib.parse import urlparse

# Read CSV
articles = []
with open('part_000000.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        articles.append(row)

# Basic stats
total_articles = len(articles)
unread_count = sum(1 for a in articles if a['status'] == 'unread')
archived_count = sum(1 for a in articles if a['status'] == 'archive')

# Date range
dates = [int(a['time_added']) for a in articles if a['time_added']]
oldest_date = datetime.fromtimestamp(min(dates)) if dates else None
newest_date = datetime.fromtimestamp(max(dates)) if dates else None

# Domain analysis
domains = []
for article in articles:
    try:
        domain = urlparse(article['url']).netloc
        if domain:
            # Remove www. prefix
            domain = domain.replace('www.', '')
            domains.append(domain)
    except:
        pass

domain_counts = Counter(domains)
top_domains = domain_counts.most_common(20)

# Tag analysis
all_tags = []
for article in articles:
    if article['tags']:
        tags = [tag.strip() for tag in article['tags'].split(',')]
        all_tags.extend(tags)

tag_counts = Counter(all_tags)
top_tags = tag_counts.most_common(20)

# Articles by year
articles_by_year = defaultdict(int)
for article in articles:
    if article['time_added']:
        year = datetime.fromtimestamp(int(article['time_added'])).year
        articles_by_year[year] += 1

# Title analysis
titles_with_content = [a for a in articles if a['title'] and a['title'] != a['url']]
no_title_count = len(articles) - len(titles_with_content)

# Print analysis
print(f"=== POCKET EXPORT ANALYSIS ===\n")
print(f"Total Articles: {total_articles}")
print(f"Unread: {unread_count} ({unread_count/total_articles*100:.1f}%)")
print(f"Archived: {archived_count} ({archived_count/total_articles*100:.1f}%)")
print(f"\nDate Range: {oldest_date.strftime('%Y-%m-%d')} to {newest_date.strftime('%Y-%m-%d')}")
print(f"Span: {(newest_date - oldest_date).days} days ({(newest_date - oldest_date).days/365:.1f} years)")

print(f"\n=== TOP 20 DOMAINS ===")
for domain, count in top_domains:
    print(f"{domain}: {count} articles ({count/total_articles*100:.1f}%)")

print(f"\n=== ARTICLES BY YEAR ===")
for year in sorted(articles_by_year.keys()):
    print(f"{year}: {articles_by_year[year]} articles")

if top_tags:
    print(f"\n=== TOP TAGS ===")
    for tag, count in top_tags:
        print(f"{tag}: {count} articles")
else:
    print(f"\n=== TAGS ===")
    print("No tags found in the export")

print(f"\n=== ADDITIONAL INSIGHTS ===")
print(f"Articles without proper titles: {no_title_count} ({no_title_count/total_articles*100:.1f}%)")
print(f"Average articles per day: {total_articles/(newest_date - oldest_date).days:.2f}")

# Find reading patterns
months_active = set()
for article in articles:
    if article['time_added']:
        date = datetime.fromtimestamp(int(article['time_added']))
        months_active.add((date.year, date.month))

print(f"Months with saves: {len(months_active)} out of {int((newest_date - oldest_date).days/30)} possible months")

# Look for interesting patterns in titles
title_words = []
for article in titles_with_content:
    words = article['title'].lower().split()
    title_words.extend([w for w in words if len(w) > 4])  # Only words > 4 chars

common_words = Counter(title_words).most_common(15)
print(f"\n=== COMMON WORDS IN TITLES ===")
for word, count in common_words:
    if count > 5:  # Only show words that appear more than 5 times
        print(f"{word}: {count}")

# Check for specific topics
tech_keywords = ['ai', 'artificial', 'intelligence', 'machine', 'learning', 'data', 'programming', 'code', 'software', 'tech', 'computer', 'algorithm']
business_keywords = ['business', 'startup', 'entrepreneur', 'company', 'market', 'finance', 'money', 'invest']

tech_count = sum(1 for a in titles_with_content if any(kw in a['title'].lower() for kw in tech_keywords))
business_count = sum(1 for a in titles_with_content if any(kw in a['title'].lower() for kw in business_keywords))

print(f"\n=== TOPIC ANALYSIS ===")
print(f"Tech/AI related: {tech_count} articles ({tech_count/total_articles*100:.1f}%)")
print(f"Business related: {business_count} articles ({business_count/total_articles*100:.1f}%)")