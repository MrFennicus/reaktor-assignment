web: if [ "$END" == "frontend" ]; then
  cd frontend && npm start
else
  cd backend && deno run --allow-all --unstable ${PORT}
fi