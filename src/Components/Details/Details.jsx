import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import Login from "../Modal/Login";
import Sell from "../Modal/Sell";
import { ItemsContext } from "../Context/Items";

export default function Details() {
  const { item } = useLocation().state || {};
  const [openModal, setModal] = useState(false);
  const [openModalSell, setModalSell] = useState(false);
  const itemsCtx = ItemsContext();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const toggleModal = () => setModal(!openModal);
  const toggleModalSell = () => setModalSell(!openModalSell);

  // Get images array - support both new (imageUrls) and old (imageUrl) format
  const images = item?.imageUrls && item.imageUrls.length > 0 
    ? item.imageUrls 
    : item?.imageUrl 
    ? [item.imageUrl] 
    : [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleImageClick = () => {
    setIsZoomed(!isZoomed);
    if (!isZoomed) {
      setZoomPosition({ x: 50, y: 50 }); // Reset to center when zooming in
    }
  };

  const handleMouseMove = (e) => {
    if (isZoomed) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomPosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
    }
  };

  const handleMouseLeave = () => {
    if (isZoomed) {
      setIsZoomed(false);
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <Navbar toggleModal={toggleModal} toggleModalSell={toggleModalSell} />
      <Login toggleModal={toggleModal} status={openModal} />

      {/* ---------- MAIN BODY ---------- */}
      <div className="max-w-7xl mx-auto px-4 mt-6">

        {/* ---------- IMAGE GALLERY SECTION ---------- */}
        <div className="w-full space-y-4">
          {/* Main Image Display */}
          <div className="w-full bg-black flex items-center justify-center h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-md relative overflow-hidden group">
            {images.length > 0 ? (
              <>
                <img
                  src={images[currentImageIndex]}
                  alt={item?.title || `Image ${currentImageIndex + 1}`}
                  className={`object-contain w-full h-full rounded-md transition-transform duration-200 ${
                    isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
                  }`}
                  onClick={handleImageClick}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  style={isZoomed ? {
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    transform: 'scale(2.5)'
                  } : {}}
                />
                
                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all z-10"
                      aria-label="Previous image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" stroke="#000">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all z-10"
                      aria-label="Next image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" stroke="#000">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                )}

                {/* Zoom Indicator */}
                {isZoomed && (
                  <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded text-sm">
                    Click to zoom out
                  </div>
                )}

                {/* Wish Icon */}
                <button className="absolute right-4 top-4 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-all z-10">
                  ♥
                </button>

                {/* Share Icon */}
                <button className="absolute right-16 top-4 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-all z-10">
                  ↻
                </button>
              </>
            ) : (
              <div className="text-white text-center">
                <p>No images available</p>
              </div>
            )}
          </div>

          {/* Thumbnail Navigation */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
                    currentImageIndex === index
                      ? 'border-teal-500 ring-2 ring-teal-200'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* BELOW: PRODUCT TITLE + PRICE SIDE */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">  {/* Added md:2 for tablets */}

          {/* LEFT SECTION */}
          <div className="col-span-1 md:col-span-2 space-y-6">  {/* Span 2 on md+ */}

            {/* Title + badge */}
            <div className="bg-white p-5 rounded-md shadow">
              <span className="bg-yellow-400 px-2 py-1 text-xs rounded font-bold">
                FEATURED
              </span>

              <h1 className="text-2xl font-bold mt-3">{item?.title}</h1>

              <p className="text-gray-600 mt-1">{item?.category}</p>

              <div className="flex gap-3 mt-3 text-gray-700 text-sm flex-wrap">
                {item?.oilType && <span>🚗 {item.oilType}</span>}
                {item?.kmRun && <span>📍 {item.kmRun} km</span>}
                {item?.isAutomatic && <span>⚙ {item.isAutomatic}</span>}
              </div>
            </div>

            {/* Overview */}
            <div className="bg-white p-5 rounded-md shadow">
              <h2 className="text-xl font-semibold mb-4">Overview</h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Condition</p>
                  <p className="font-semibold">{item?.condition || "N/A"}</p>
                </div>

                <div>
                  <p className="text-gray-500">Location</p>
                  <p className="font-semibold">{item?.location || "N/A"}</p>
                </div>

                <div>
                  <p className="text-gray-500">Posted Date</p>
                  <p className="font-semibold">
                    {item?.postedDate 
                      ? new Date(item.postedDate).toLocaleDateString('en-GB', { 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric' 
                        })
                      : item?.createdAtFormatted || "N/A"}
                  </p>
                </div>

                {item?.oilType && (
                  <div>
                    <p className="text-gray-500">Oil Type</p>
                    <p className="font-semibold">{item.oilType}</p>
                  </div>
                )}

                {item?.kmRun && (
                  <div>
                    <p className="text-gray-500">KM Run</p>
                    <p className="font-semibold">{item.kmRun} km</p>
                  </div>
                )}

                {item?.isAutomatic && (
                  <div>
                    <p className="text-gray-500">Transmission</p>
                    <p className="font-semibold">{item.isAutomatic}</p>
                  </div>
                )}

                <div>
                  <p className="text-gray-500">Created Date</p>
                  <p className="font-semibold">
                    {item?.createdAtFormatted 
                      || (item?.createdAt 
                        ? new Date(item.createdAt).toLocaleDateString('en-GB', { 
                            day: 'numeric', 
                            month: 'short', 
                            year: 'numeric' 
                          })
                        : "N/A")}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-5 rounded-md shadow">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-gray-700 leading-7">
                {item?.description}
              </p>
            </div>
          </div>

          {/* RIGHT SIDE PRICE BOX */}
          <div className="space-y-6">

            {/* PRICE BOX */}
            <div className="bg-white p-5 rounded-md shadow text-center lg:text-left">
              <h2 className="text-3xl font-bold text-gray-900">
                ₹ {item?.price}
              </h2>

              <button
                className="w-full bg-blue-700 text-white py-3 rounded-md mt-5 font-bold hover:bg-blue-800"
              >
                Make offer
              </button>
            </div>

            {/* SELLER INFO */}
            <div className="bg-white p-5 rounded-md shadow">
              <h3 className="text-lg font-semibold">Posted By {item?.userName}</h3>
              <p className="text-sm text-gray-500 mb-3">Member since Aug 2013</p>

              <div className="h-px bg-gray-200 mb-3"></div>

              <button className="w-full border border-gray-800 py-2 rounded-md hover:bg-gray-50 font-semibold">
                Chat with seller
              </button>
            </div>

            {/* LOCATION */}
            <div className="bg-white p-5 rounded-md shadow">
              <h3 className="text-lg font-semibold mb-2">Posted in</h3>
              <p className="text-gray-700 mb-3">{item?.location || "Location not specified"}</p>

              <div className="w-full h-40 bg-gray-200 rounded-md"></div>  {/* Consider making h-auto if map is dynamic */}
            </div>

          </div>
        </div>
      </div>

      {/* SELL MODAL */}
      <Sell
        setItems={itemsCtx.setItems}
        toggleModal={toggleModalSell}
        status={openModalSell}
      />


      <Footer />
    </>
  );
}