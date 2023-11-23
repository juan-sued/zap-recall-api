import app, { init } from './app';
const PORT: string = process.env.PORT;

init().then(() => {
  app.listen(PORT, () => {
    /* eslint-disable-next-line no-console */
    console.log(`Server is listening on port ${PORT}.`);
  });
});
