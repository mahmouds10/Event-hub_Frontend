import { RouterProvider } from "react-router-dom";
import { router } from "../src/routes/app.routes.jsx";
import { UserContextProvider } from "./contexts/user.context.jsx";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BooksProvider } from "./contexts/books.context.jsx";

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <UserContextProvider>
                <BooksProvider>
                    <RouterProvider router={router} />
                    <Toaster />
                </BooksProvider>
            </UserContextProvider>
        </QueryClientProvider>
    );
}

export default App;
