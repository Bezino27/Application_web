#!/bin/bash
echo "🧹 Resetovanie React web prostredia..."

# Zastavenie bežiacich procesov (napr. Vite, React dev server)
echo "⛔ Zastavujem bežiace procesy..."
killall -9 node 2>/dev/null

# Vyčistenie dočasných súborov a buildov
echo "🧼 Odstraňujem cache a staré buildy..."
rm -rf node_modules dist build .cache .vite
rm -f package-lock.json

# Vyčistenie npm cache
echo "🧽 Čistím npm cache..."
npm cache clean --force

# Znovu nainštalovanie závislostí
echo "📦 Inštalujem balíky nanovo..."
npm install

# Zvýšenie systémových limitov (ak je to potrebné)
ulimit -n 8192 2>/dev/null
ulimit -u 2048 2>/dev/null

# Spustenie vývojového servera (Vite / React)
echo "🚀 Spúšťam vývojový server..."
npm run dev

echo "✅ Hotovo!"
