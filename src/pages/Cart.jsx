import React, { useContext, useEffect, useState } from "react";
import BookingItem from "../components/BookingItem.jsx";
import CartDevider from "../components/CartDevider.jsx";
import { CiBoxList } from "react-icons/ci";
import CartLoading from "../components/CartLoading.jsx";
import empty from "../assets/error-in-calendar.svg";
import { BooksContext } from "../contexts/books.context.jsx";

const Cart = () => {
    const [total, setTotal] = useState(0);
    const {
        books,
        isLoading: isCartLoading,
        fetchBookings,
    } = useContext(BooksContext);

    useEffect(() => {
        document.title = "Booked Events";
    }, []);

    useEffect(() => {
        const totalPrice = books.reduce((acc, book) => {
            return acc + book.event.price;
        }, 0);
        setTotal(totalPrice);
    }, [books]);

    if (isCartLoading) return <CartLoading />;

    if (books.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center py-10">
                <img src={empty} alt="Empty" className="w-1/3 max-w-xs" />
                <p className="text-gray-600 mt-4 text-center text-lg">
                    No booked events yet.
                </p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-3 md:px-0 py-8">
            <h1 className="text-2xl flex items-center justify-center gap-2 font-bold mb-6">
                <CiBoxList className="text-3xl" />
                Booked Events
            </h1>
            <CartDevider />
            <div className="flex flex-col gap-4 ">
                <div className=" flex flex-wrap gap-4 items-center justify-center">
                    {books.map((book) => (
                        <div
                            className="w-full md:w-[48%] lg:w-[30%]"
                            key={book._id}
                        >
                            <BookingItem
                                booking={book}
                                fetchBookings={fetchBookings}
                            />
                        </div>
                    ))}
                </div>
                <CartDevider />

                <div className="w-full  mx-auto bg-white border rounded-md p-5 shadow-sm mt-6">
                    <h2 className="text-lg font-semibold mb-4">Summary</h2>
                    <div className="flex justify-between mb-2">
                        <span>Subtotal:</span>
                        <span>{total} EGP</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span>Shipping:</span>
                        <span>0 EGP</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span>{total} EGP</span>
                    </div>
                    <button className="mt-4 w-full bg-primary hover:bg-primary-hover text-white py-2 rounded-md transition">
                        Pay Online
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
