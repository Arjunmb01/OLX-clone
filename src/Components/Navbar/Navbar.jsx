import React, { useState, useEffect } from 'react';
import './Navbar.css';
import logo from '../../assets/symbol.png';
import search from '../../assets/search1.svg';
import arrow from '../../assets/arrow-down.svg';
import searchWt from '../../assets/search.svg';
import addBtn from '../../assets/addButton.png';
import chatIcon from '../../assets/chat.svg';
import heartIcon from '../../assets/heart.svg';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../Firebase/Firebase';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';

const Navbar = ({ toggleModal, toggleModalSell }) => {
    const [user] = useAuthState(auth);
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleLogout = async () => {
        await signOut(auth);
        setShowDropdown(false);
        navigate('/');
    };

    return (
        <header className={`w-full z-50 top-0 left-0 ${scrolled ? 'shadow-md' : ''} bg-white`}>
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">

                <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">

                        <Link to="/">
                            <img
                                src={logo}
                                alt="OLX Logo"
                                className="w-10 h-10 object-contain cursor-pointer"
                            />
                        </Link>

                        <button
                            className="md:hidden p-2 rounded-md hover:bg-gray-100"
                            aria-label="Toggle menu"
                            onClick={() => setMobileOpen(v => !v)}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {mobileOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>


                    <div className="flex-1 mx-3 hidden sm:flex items-center gap-3">

                        <div className="relative shrink-0">
                            <img src={search} alt="" className="absolute left-3 top-3 w-4 opacity-60" />
                            <input
                                type="text"
                                placeholder="Search city, area, or locality..."
                                className="pl-10 pr-8 py-2 w-36 sm:w-44 md:w-56 lg:w-72 border rounded-md focus:outline-none focus:ring-1 focus:ring-teal-300"
                            />
                            <img src={arrow} alt="dropdown" className="absolute right-2 top-3 w-4" />
                        </div>

                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Find Cars, Mobile Phones, and More..."
                                className="w-full py-2 pl-3 pr-12 border rounded-md focus:outline-none focus:ring-1 focus:ring-teal-300"
                            />
                            <div
                                style={{ backgroundColor: '#002f34' }}
                                className="absolute right-0 top-0 h-full w-10 rounded-r-md flex items-center justify-center"
                            >
                                <img className="w-4 invert" src={searchWt} alt="search" />
                            </div>
                        </div>
                    </div>


                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-4">
                            <div className="hidden md:flex items-center gap-2">
                                <span className="text-sm font-medium">English</span>
                                <img src={arrow} alt="" className="w-4" />
                            </div>

                            {!user ? (
                                <button
                                    onClick={toggleModal}
                                    className="text-sm font-semibold underline text-teal-800"
                                >
                                    Login
                                </button>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <button title="Chat" className="p-1">
                                        <img src={chatIcon} alt="chat" className="w-6 h-6" />
                                    </button>
                                    <button title="Favorites" className="p-1">
                                        <img src={heartIcon} alt="favs" className="w-6 h-6" />
                                    </button>

                                    <div className="relative">
                                        <button
                                            onClick={() => setShowDropdown(v => !v)}
                                            className="flex items-center gap-2 text-sm font-semibold"
                                            aria-haspopup="true"
                                            aria-expanded={showDropdown}
                                        >
                                            {user.displayName?.split(' ')[0] || 'User'}
                                            <svg className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>

                                        {showDropdown && (
                                            <div className="absolute right-0 mt-2 w-36 bg-white border rounded-md shadow-lg">
                                                <Link to="/myads" className="block px-4 py-2 text-sm hover:bg-gray-50" onClick={() => setShowDropdown(false)}>My Ads</Link>
                                                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50" onClick={handleLogout}>Logout</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={user ? toggleModalSell : toggleModal}
                            className="flex items-center"
                            aria-label="Sell"
                        >
                            <img src={addBtn} alt="sell" className="w-20 sm:w-24 rounded-full shadow-md" />
                        </button>
                    </div>
                </div>


                <nav className="mt-1 border-t pt-2">
                    <div className={`overflow-x-auto sub-lists hide-scrollbar`}>
                        <ul className="flex gap-4 items-center whitespace-nowrap px-1 md:px-4">
                            <li className="flex items-center gap-2 font-semibold uppercase text-sm">
                                <span>All categories</span>
                                <img src={arrow} alt="" className="w-3" />
                            </li>
                            <li className="category-item">Cars</li>
                            <li className="category-item">Motorcycles</li>
                            <li className="category-item">Mobile Phones</li>
                            <li className="category-item">For sale : Houses & Apartments</li>
                            <li className="category-item">Scooter</li>
                            <li className="category-item">Commercial & Other Vehicles</li>
                            <li className="category-item">For rent : Houses & Apartments</li>
                        </ul>
                    </div>
                </nav>
            </div>

            {mobileOpen && (
                <div className="md:hidden bg-white border-t shadow-inner">
                    <div className="px-4 py-3 space-y-3">
                        <div>
                            <input
                                type="text"
                                placeholder="Find Cars, Mobile Phones, and More..."
                                className="w-full py-2 pl-3 pr-3 border rounded-md focus:outline-none"
                            />
                        </div>
                        <div className="flex gap-2">
                            {!user ? (
                                <button className="flex-1 py-2 border rounded-md" onClick={toggleModal}>Login</button>
                            ) : (
                                <>
                                    <Link 
                                        to="/myads" 
                                        className="flex-1 py-2 border rounded-md text-center"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        My Ads
                                    </Link>
                                    <button 
                                        className="flex-1 py-2 border rounded-md" 
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </>
                            )}
                            <button className="flex-1 py-2 border rounded-md" onClick={() => (user ? toggleModalSell() : toggleModal())}>Sell</button>
                        </div>

                        {user && (
                            <div className="pt-2 border-t">
                                <p className="text-sm font-semibold text-gray-700">
                                    {user.displayName?.split(' ')[0] || 'User'}
                                </p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                            <button className="px-3 py-1 rounded-full border text-sm">Cars</button>
                            <button className="px-3 py-1 rounded-full border text-sm">Motorcycles</button>
                            <button className="px-3 py-1 rounded-full border text-sm">Mobile Phones</button>
                            <button className="px-3 py-1 rounded-full border text-sm">Houses</button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
