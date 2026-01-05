import app from "./app";
import { PORT } from "./configs/env.config";
import { connectDB } from "./configs/db.config";

// Connect DB locally 
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
