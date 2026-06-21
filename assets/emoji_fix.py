import os
import re

base_dir = r"c:\D\Learn\1PROJECTS\Camino\CaminoV2\assets\js"

# 1. Update utils.js to remove '🧗': 'mountain'
utils_path = os.path.join(base_dir, "utils.js")
with open(utils_path, "r", encoding="utf-8") as f:
    utils_content = f.read()

utils_content = re.sub(r"\s*'🧗': 'mountain',?", "", utils_content)
with open(utils_path, "w", encoding="utf-8") as f:
    f.write(utils_content)

# 2. Update route.js
route_path = os.path.join(base_dir, "ui", "route.js")
with open(route_path, "r", encoding="utf-8") as f:
    route_content = f.read()

route_content = re.sub(r'<svg[^>]*><use href="#icon-happy"></svg>', '😊', route_content)
with open(route_path, "w", encoding="utf-8") as f:
    f.write(route_content)

# 3. Update history.js
history_path = os.path.join(base_dir, "ui", "history.js")
with open(history_path, "r", encoding="utf-8") as f:
    history_content = f.read()

history_content = re.sub(r'<svg[^>]*><use href="#icon-mountain"></svg>', '🧗', history_content)
history_content = re.sub(r'<svg[^>]*><use href="#icon-roman"></svg>', '🏛️', history_content)
history_content = re.sub(r'<svg[^>]*><use href="#icon-happy"></svg>', '😊', history_content)

# Fix flags in history.js
history_content = history_content.replace("{ icon: 'icon-flag-ua', text:", "{ emoji: '🇺🇦', text:")
# Update template
history_content = history_content.replace('<div class="hist-fact-icon"><svg class="icon"><use href="#${f.icon}"></svg></div>',
                                          '<div class="hist-fact-icon">${f.emoji ? `<span style="font-size:24px">${f.emoji}</span>` : `<svg class="icon"><use href="#${f.icon}"></svg>`}</div>')

with open(history_path, "w", encoding="utf-8") as f:
    f.write(history_content)

print("Emoji cleanup done.")
