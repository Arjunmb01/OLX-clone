import { Modal, ModalBody } from "flowbite-react";
import { useState } from "react";
import { UserAuth } from "../Context/Auth";
import { addDoc, collection } from "firebase/firestore";
import { fireStore, fetchFromFirestore } from "../Firebase/Firebase";
import fileUpload from "../../assets/fileUpload.svg";
import loading from "../../assets/loading.gif";
import close from "../../assets/close.svg";

const Sell = (props) => {
  const { toggleModal, toggleModalSell, onClose, status, setItems } = props;

  // select first valid close callback (if any)
  const closeCallback =
    typeof toggleModal === "function"
      ? toggleModal
      : typeof toggleModalSell === "function"
      ? toggleModalSell
      : typeof onClose === "function"
      ? onClose
      : null;

  const safeClose = (e) => {

    if (e && typeof e.stopPropagation === "function") e.stopPropagation();

    if (closeCallback) {
      try {
        closeCallback();
      } catch (err) {
        console.warn("Close callback threw an error:", err);
      }
    } else {
      console.warn(
        "Sell modal: no close callback provided. Pass a function as `toggleModal`, `toggleModalSell`, or `onClose`."
      );
    }
  };

  const auth = UserAuth();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [condition, setCondition] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [postedDate, setPostedDate] = useState("");
  const [oilType, setOilType] = useState("");
  const [kmRun, setKmRun] = useState("");
  const [isAutomatic, setIsAutomatic] = useState("");
  const [images, setImages] = useState([]);

  const [submitting, setSubmitting] = useState(false);

  const categories = ["Cars", "Bikes", "Mobiles", "Electronics", "Properties", "Fashion", "Furniture"];
  const locations = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", 
    "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Surat",
    "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane"
  ];
  const conditions = ["Used", "New"];
  const oilTypes = ["Petrol", "Diesel", "Electric", "CNG", "Hybrid", "LPG"];
  const transmissionTypes = ["Automatic", "Manual"];

  const handleImageUpload = (event) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setImages(prev => [...prev, ...files]);
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const readImageAsDataUrl = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!auth?.user) {
      alert("Please login to continue");
      return;
    }

    setSubmitting(true);

    let imageUrls = [];
    if (images.length > 0) {
      try {
        const imagePromises = images.map(file => readImageAsDataUrl(file));
        imageUrls = await Promise.all(imagePromises);
      } catch (err) {
        console.log(err);
        alert("Failed to upload images");
        setSubmitting(false);
        return;
      }
    }

    if (!title || !category || !location || !condition || !price || !description || !postedDate) {
      alert("All required fields must be filled");
      setSubmitting(false);
      return;
    }

    try {
      const currentDate = new Date();
      await addDoc(collection(fireStore, "products"), {
        title,
        category,
        location,
        condition,
        price,
        description,
        postedDate,
        oilType: oilType || "",
        kmRun: kmRun || "",
        isAutomatic: isAutomatic || "",
        imageUrls: imageUrls.length > 0 ? imageUrls : [],
        imageUrl: imageUrls.length > 0 ? imageUrls[0] : "", // Keep for backward compatibility
        userId: auth.user.uid,
        userName: auth.user.displayName || "Anonymous",
        createdAt: currentDate.toISOString(),
        createdAtFormatted: currentDate.toDateString(),
      });

      // refresh parent items if setter provided
      if (typeof setItems === "function") {
        try {
          const newItems = await fetchFromFirestore();
          setItems(newItems);
        } catch (err) {
          console.warn("Failed to fetch new items after add:", err);
        }
      }

      // close modal (safe)
      safeClose();
    } catch (error) {
      console.log(error);
      alert("Failed to add product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      show={status}
      onClick={() => {
        // clicking outside should close the modal via provided callback (if any)
        if (closeCallback) closeCallback();
      }}
      popup={true}
      size="sm"  // Reduced width
      className="bg-black bg-opacity-60"
      theme={{
        content: {
          base: "relative w-full p-4 max-w-md mx-auto",
          inner: "relative rounded-lg bg-white shadow",
        },
      }}
    >
      <img
        onClick={safeClose}
        src={close}
        alt="close"
        className="w-6 absolute top-4 right-4 cursor-pointer z-50"
      />

      <ModalBody onClick={(e) => e.stopPropagation()} className="p-0 rounded-lg">
        {/* HEADER */}
        <div className="p-4 sm:p-6 border-b relative">
          <h1 className="text-xl font-bold text-[#002f34]">Sell Your Item</h1>
        </div>

        {/* BODY FORM */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="font-semibold text-gray-700">Title</label>
            <input
              type="text"
              className="w-full p-3 mt-1 border rounded-md focus:ring-1 focus:ring-teal-600"
              placeholder="Enter your item title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Category */}
          <div>
            <label className="font-semibold text-gray-700">Category</label>
            <select
              className="w-full p-3 mt-1 border rounded-md focus:ring-1 focus:ring-teal-600 bg-white"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="font-semibold text-gray-700">Location</label>
            <select
              className="w-full p-3 mt-1 border rounded-md focus:ring-1 focus:ring-teal-600 bg-white"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="">Select Location</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Condition */}
          <div>
            <label className="font-semibold text-gray-700">Condition</label>
            <select
              className="w-full p-3 mt-1 border rounded-md focus:ring-1 focus:ring-teal-600 bg-white"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
            >
              <option value="">Select Condition</option>
              {conditions.map((cond) => (
                <option key={cond} value={cond}>
                  {cond}
                </option>
              ))}
            </select>
          </div>

          {/* Posted Date */}
          <div>
            <label className="font-semibold text-gray-700">Posted Date</label>
            <input
              type="date"
              className="w-full p-3 mt-1 border rounded-md focus:ring-1 focus:ring-teal-600"
              value={postedDate}
              onChange={(e) => setPostedDate(e.target.value)}
            />
          </div>

          {/* Type of Oil Used */}
          <div>
            <label className="font-semibold text-gray-700">Type of Oil Used</label>
            <select
              className="w-full p-3 mt-1 border rounded-md focus:ring-1 focus:ring-teal-600 bg-white"
              value={oilType}
              onChange={(e) => setOilType(e.target.value)}
            >
              <option value="">Select Oil Type (Optional)</option>
              {oilTypes.map((oil) => (
                <option key={oil} value={oil}>
                  {oil}
                </option>
              ))}
            </select>
          </div>

          {/* How Many KM Run */}
          <div>
            <label className="font-semibold text-gray-700">How Many KM Run</label>
            <input
              type="number"
              className="w-full p-3 mt-1 border rounded-md focus:ring-1 focus:ring-teal-600"
              placeholder="Enter kilometers (Optional)"
              value={kmRun}
              onChange={(e) => setKmRun(e.target.value)}
            />
          </div>

          {/* Is it Automatic */}
          <div>
            <label className="font-semibold text-gray-700">Transmission Type</label>
            <select
              className="w-full p-3 mt-1 border rounded-md focus:ring-1 focus:ring-teal-600 bg-white"
              value={isAutomatic}
              onChange={(e) => setIsAutomatic(e.target.value)}
            >
              <option value="">Select Transmission (Optional)</option>
              {transmissionTypes.map((trans) => (
                <option key={trans} value={trans}>
                  {trans}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="font-semibold text-gray-700">Price (₹)</label>
            <input
              type="number"
              className="w-full p-3 mt-1 border rounded-md focus:ring-1 focus:ring-teal-600"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <label className="font-semibold text-gray-700">Description</label>
            <textarea
              rows="4"
              className="w-full p-3 mt-1 border rounded-md focus:ring-1 focus:ring-teal-600"
              placeholder="Write details about your item..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          {/* Image Upload */}
          <div>
            <label className="font-semibold text-gray-700">Upload Images (Multiple)</label>

            {/* Image Preview Grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2 mb-3">
                {images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`preview-${index}`}
                      className="w-full h-32 object-cover rounded-md border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Area */}
            <div className="w-full mt-2 h-32 border-2 border-dashed border-gray-300 rounded-md bg-gray-50 flex items-center justify-center overflow-hidden relative cursor-pointer hover:border-teal-500 transition-colors">
              <div className="text-center">
                <img src={fileUpload} className="w-8 mx-auto opacity-60" />
                <p className="text-gray-500 text-xs mt-1">
                  {images.length > 0 ? `Add more images (${images.length} added)` : "Click to upload images"}
                </p>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleImageUpload}
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            {submitting ? (
              <div className="flex justify-center">
                <img src={loading} className="w-24" alt="loading" />
              </div>
            ) : (
              <button
                type="submit"
                className="w-full p-3 text-white font-semibold rounded-md"
                style={{ backgroundColor: "#002f34" }}
              >
                Post Now
              </button>
            )}
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
};

export default Sell;