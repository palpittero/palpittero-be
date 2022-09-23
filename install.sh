if [${NODE_ENV} = "dev"]
then
  npm run dev
elif [ ${NODE_ENV} = "staging" ]
then
  npm run staging
else
  npm run production
fi