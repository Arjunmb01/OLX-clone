import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from "../Firebase/Firebase";
import { fetchMyAds, fireStore } from "../Firebase/Firebase";
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Modal, ModalBody } from 'flowbite-react';
import Input from '../Input/Input'
import fileUpload from '../../assets/fileUpload.svg';
import close from '../../assets/close.svg';
import loading from '../../assets/loading.gif';

const EditModal = ({ item, onClose, onSave }) => {
    const [title, setTitle] = useState(item.title);
    const [category, setCategory] = useState(item.category);
    const [price, setPrice] = useState(item.price);
    const [description, setDescription] = useState(item.description);
    const [image, setImage] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const readImage = (file) =>
        new Promise((res, rej) => {
            const r = new FileReader()
            r.onloadend = () => res(r.result);
            r.onerror = rej
            r.readAsDataURL(file)
        })

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

const MyAds = () => {
    const [user] = useAuthState(auth);
    const [myItems, setMyItems] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const loadMyAds = async () => {
        if (user) {
            const data = await fetchMyAds(user.uid);
            setMyItems(data);
        }
    };

    useEffect(() => {
        loadMyAds();
    }, [user]);

    const handleDelete = async () => {
        await deleteDoc(doc(fireStore, 'products', deletingId));
        setMyItems((prev) => prev.filter((i) => i.id !== deletingId));
        setDeletingId(null);
    };

    const handleEditSave = () => {
        loadMyAds();               
        setEditingItem(null);
    };

    if (!user) return <p className="text-center pt-24">Please log in to see your ads.</p>;

    return (
        <div className="pt-24 p-4 min-h-screen">
            <h1 className="text-2xl font-bold mb-6" style={{ color: '#002f34' }}>
                My Ads
            </h1>

            {myItems.length === 0 ? (
                <p className="text-center text-gray-600">You haven't posted any ads yet.</p>
            ) : (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {myItems.map((item) => (
                        <div
                            key={item.id}
                            className="relative border border-gray-300 rounded-md p-4 bg-white shadow-sm"
                        >

                            <div className="cursor-default">
                                <img
                                    src={item.imageUrl || 'https://via.placeholder.com/150'}
                                    alt={item.title}
                                    className="w-full h-40 object-contain"
                                />
                                <h3 className="font-bold text-xl mt-2">₹ {item.price}</h3>
                                <p className="text-sm text-gray-600">{item.category}</p>
                                <p className="mt-1">{item.title}</p>
                            </div>

                            {/* Edit / Delete buttons */}
                            <div className="flex gap-2 mt-3">
                                <button
                                    onClick={() => setEditingItem(item)}
                                    className="flex-1 bg-teal-600 text-white py-1 rounded"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => setDeletingId(item.id)}
                                    className="flex-1 bg-red-600 text-white py-1 rounded"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

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
                        <p className="mb-4">Are you sure you want to delete this ad?</p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded"
                            >
                                Yes, Delete
                            </button>
                            <button
                                onClick={() => setDeletingId(null)}
                                className="px-4 py-2 bg-gray-300 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </ModalBody>
                </Modal>
            )}
        </div>
    );
};

export default MyAds;

