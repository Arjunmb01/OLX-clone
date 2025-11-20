import { useEffect, useState, useRef } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from "../Firebase/Firebase";
import { fetchMyAds, fireStore } from "../Firebase/Firebase";
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Modal, ModalBody } from 'flowbite-react';
import Input from '../Input/Input';
import fileUpload from '../../assets/fileUpload.svg';
import close from '../../assets/close.svg';
import loading from '../../assets/loading.gif';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import Login from '../Modal/Login';
import Sell from '../Modal/Sell';
import { ItemsContext } from '../Context/Items';

const EditModal = ({ item, onClose, onSave }) => {
    const [title, setTitle] = useState(item.title);
    const [category, setCategory] = useState(item.category);
    const [price, setPrice] = useState(item.price);
    const [description, setDescription] = useState(item.description);
    const [image, setImage] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const readImage = (file) =>
        new Promise((res, rej) => {
            const r = new FileReader();
            r.onloadend = () => res(r.result);
            r.onerror = rej;
            r.readAsDataURL(file);
        });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        let imageUrl = item.imageUrl;
        if (image) imageUrl = await readImage(image);

        await updateDoc(doc(fireStore, 'products', item.id), {
            title,
            category,
            price,
            description,
            imageUrl,
        });
        setSubmitting(false);
        onSave();
        onClose();
    };

    return (
        <Modal show={true} onClose={onClose} size="md" popup>
            <ModalBody className="p-0">
                <img
                    src={close}
                    alt="close"
                    className="w-6 absolute top-6 right-8 cursor-pointer z-10"
                    onClick={onClose}
                />
                <div className="p-6">
                    <p className="font-bold text-lg mb-3">Edit Item</p>
                    <form onSubmit={handleSubmit}>
                        <Input setInput={setTitle} placeholder="Title" />
                        <Input setInput={setCategory} placeholder="Category" />
                        <Input setInput={setPrice} placeholder="Price" />
                        <Input setInput={setDescription} placeholder="Description" />

                        <div className="pt-2 w-full relative">
                            {image ? (
                                <div className="h-40 border-2 border-black rounded-md overflow-hidden flex justify-center">
                                    <img src={URL.createObjectURL(image)} alt="" className="object-contain" />
                                </div>
                            ) : (
                                <div className="h-40 border-2 border-black rounded-md relative">
                                    <input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                        onChange={(e) => e.target.files && setImage(e.target.files[0])}
                                    />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <img src={fileUpload} alt="" className="w-12" />
                                        <p className="text-sm">Click to change image</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {submitting ? (
                            <div className="flex justify-center py-4">
                                <img src={loading} alt="loading" className="w-32" />
                            </div>
                        ) : (
                            <button
                                type="submit"
                                className="w-full mt-4 p-3 rounded-lg text-white"
                                style={{ backgroundColor: '#002f34' }}
                            >
                                Save Changes
                            </button>
                        )}
                    </form>
                </div>
            </ModalBody>
        </Modal>
    );
};

const EmptyState = ({ onStartSelling }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
            {/* Empty State Illustration */}
            <div className="mb-8">
                <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
                    {/* Teal circle */}
                    <circle cx="60" cy="80" r="45" fill="#23E5DB" opacity="0.8"/>
                    {/* Dark blue circle */}
                    <circle cx="140" cy="100" r="55" fill="#002F34" opacity="0.9"/>
                    {/* Pink circle */}
                    <circle cx="100" cy="140" r="35" fill="#FF6B9D" opacity="0.8"/>
                    {/* Light blue circle */}
                    <circle cx="130" cy="60" r="25" fill="#4A90E2" opacity="0.7"/>
                </svg>
            </div>

            {/* Text Content */}
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                You haven't listed anything yet
            </h2>
            <p className="text-gray-500 mb-8 text-center">
                Let go of what you<br />don't use anymore
            </p>

            {/* Start Selling Button */}
            <button
                onClick={onStartSelling}
                className="px-8 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded hover:bg-blue-50 transition"
            >
                start selling
            </button>
        </div>
    );
};

const MyAds = () => {
    const [user] = useAuthState(auth);
    const [myItems, setMyItems] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [openModal, setModal] = useState(false);
    const [openModalSell, setModalSell] = useState(false);
    const itemsCtx = ItemsContext();
    const prevModalSellRef = useRef(false);

    const toggleModal = () => setModal(!openModal);
    const toggleModalSell = () => setModalSell(!openModalSell);

    const loadMyAds = async () => {
        if (user) {
            const data = await fetchMyAds(user.uid);
            setMyItems(data);
        }
    };

    useEffect(() => {
        loadMyAds();
    }, [user]);

    // Reload ads when sell modal closes (in case a new item was added)
    useEffect(() => {
        if (prevModalSellRef.current && !openModalSell && user) {
            loadMyAds();
        }
        prevModalSellRef.current = openModalSell;
    }, [openModalSell, user]);

    const handleDelete = async () => {
        await deleteDoc(doc(fireStore, 'products', deletingId));
        setMyItems((prev) => prev.filter((i) => i.id !== deletingId));
        setDeletingId(null);
    };

    const handleEditSave = () => {
        loadMyAds();
        setEditingItem(null);
    };

    if (!user) {
        return (
            <>
                <Navbar toggleModal={toggleModal} toggleModalSell={toggleModalSell} />
                <div className="pt-24 min-h-screen bg-gray-50">
                    <p className="text-center pt-24 text-gray-600">Please log in to see your ads.</p>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar toggleModal={toggleModal} toggleModalSell={toggleModalSell} />
            <Login toggleModal={toggleModal} status={openModal} />
            <Sell 
                setItems={itemsCtx?.setItems} 
                toggleModalSell={toggleModalSell} 
                status={openModalSell}
            />
            <div className="pt-2 min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white">
                    <div className="max-w-7xl mx-auto px-4 py-4">
                        <h1 className="text-xl font-semibold" style={{ color: '#002f34' }}>
                            My Ads
                        </h1>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-7xl mx-auto px-4 py-6">
                    {myItems.length === 0 ? (
                        <EmptyState onStartSelling={toggleModalSell} />
                    ) : (
                        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {myItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition"
                                >
                                    <div className="cursor-default">
                                        <div className="h-48 bg-gray-100 flex items-center justify-center">
                                            <img
                                                src={item.imageUrl || 'https://via.placeholder.com/150'}
                                                alt={item.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-bold text-xl mb-1">₹ {item.price}</h3>
                                            <p className="text-sm text-gray-600 mb-2">{item.title}</p>
                                            <p className="text-xs text-gray-500">{item.category}</p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex border-t">
                                        <button
                                            onClick={() => setEditingItem(item)}
                                            className="flex-1 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 transition"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => setDeletingId(item.id)}
                                            className="flex-1 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition border-l"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Edit Modal */}
                {editingItem && (
                    <EditModal
                        item={editingItem}
                        onClose={() => setEditingItem(null)}
                        onSave={handleEditSave}
                    />
                )}

                {/* Delete Confirmation */}
                {deletingId && (
                    <Modal show={true} size="sm" popup onClose={() => setDeletingId(null)}>
                        <ModalBody className="p-6 text-center">
                            <p className="mb-4 text-gray-700">Are you sure you want to delete this ad?</p>
                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={handleDelete}
                                    className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                                >
                                    Yes, Delete
                                </button>
                                <button
                                    onClick={() => setDeletingId(null)}
                                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </ModalBody>
                    </Modal>
                )}
            </div>
            <Footer />
        </>
    );
};

export default MyAds;