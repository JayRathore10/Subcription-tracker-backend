import app from "./app";
import { PORT } from "./configs/env.config";
import { connectToDatabase } from "./database/mongodb";

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);

  await connectToDatabase();

});
