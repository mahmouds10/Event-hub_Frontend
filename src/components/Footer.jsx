import React from "react";

function Footer() {
    return (
        <footer className="bg-white text-slate-800 p-4">
            <div className="container mx-auto flex flex-col items-center justify-between md:flex-row">
                <div className="text-center md:text-left">
                    <p className="text-sm">
                        &copy; {new Date().getFullYear()} Mahmoud || Areeb Task. All rights
                        reserved.
                    </p>
                </div>
                <div className="flex space-x-4 mt-2 md:mt-0">
                    <a href="#" className="text-sm hover:underline">
                        About
                    </a>
                    <a href="#" className="text-sm hover:underline">
                        Privacy Policy
                    </a>
                    <a href="#" className="text-sm hover:underline">
                        Licensing
                    </a>
                    <a href="#" className="text-sm hover:underline">
                        Contact
                    </a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
