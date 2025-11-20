import { Modal, ModalBody, Carousel } from "flowbite-react";
import google from "../../assets/google.png";
import mobile from "../../assets/mobile.svg";
import guitar from "../../assets/guita.png";
import love from "../../assets/love.png";
import avatar from "../../assets/avatar.png";
import close from "../../assets/close.svg";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../Firebase/Firebase";

const Login = ({ toggleModal, status }) => {
  const handleGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      toggleModal();
      console.log("User", result.user);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Modal
        theme={{
          content: {
            base: "relative w-full p-0 md:h-auto",
            inner:
              "relative flex max-h-[90dvh] flex-col rounded-lg bg-white shadow",
          },
        }}
        onClick={toggleModal}
        className="bg-black bg-opacity-50"
        position={"center"}
        show={status}
        size="md"
        popup={true}
      >
        {/* TOP CAROUSEL */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white p-4 pb-0 relative rounded-t-lg"
        >
          <img
            onClick={toggleModal}
            src={close}
            alt="close"
            className="w-6 absolute top-4 right-4 cursor-pointer z-20"
          />

          <Carousel
            slide={false}
            className="w-full h-48 sm:h-56 rounded-md"
            theme={{
              indicators: {
                active: { on: "bg-teal-400", off: "bg-gray-300" },
                base: "h-2 w-2 rounded-full",
                wrapper:
                  "absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2",
              },
            }}
          >
            {/* Slide 1 */}
            <div className="flex flex-col items-center justify-center">
              <img className="w-24 pb-3" src={guitar} alt="slide-img" />
              <p className="text-center font-semibold px-6 text-sm text-[#002f34]">
                Help us become one of the safest places to buy and sell.
              </p>
            </div>

            {/* Slide 2 */}
            <div className="flex flex-col items-center justify-center">
              <img className="w-24 pb-3" src={love} alt="slide-img" />
              <p className="text-center font-semibold px-6 text-sm text-[#002f34]">
                Close deals from the comfort of your home.
              </p>
            </div>

            {/* Slide 3 */}
            <div className="flex flex-col items-center justify-center">
              <img className="w-24 pb-3" src={avatar} alt="slide-img" />
              <p className="text-center font-semibold px-6 text-sm text-[#002f34]">
                Keep all your favorites in one place.
              </p>
            </div>
          </Carousel>
        </div>

        {/* BOTTOM BODY */}
        <ModalBody
          className="bg-white p-5 sm:p-6 rounded-b-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Phone Login */}
          <div className="flex items-center border border-black rounded-md px-4 py-3 mb-4 cursor-pointer hover:bg-gray-50 transition">
            <img src={mobile} className="w-6 mr-3" alt="mobile" />
            <p className="text-sm font-bold">Continue with phone</p>
          </div>

          {/* Google Login */}
          <div
            onClick={handleGoogle}
            className="flex items-center border border-gray-300 rounded-md px-4 py-3 cursor-pointer active:bg-teal-100 transition relative"
          >
            <img src={google} className="w-6 mr-3" alt="google" />
            <p className="text-sm text-gray-600">Continue with Google</p>
          </div>

          {/* Divider */}
          <div className="pt-5 flex flex-col items-center">
            <p className="font-semibold text-xs text-gray-600">OR</p>
            <p className="font-bold text-sm pt-2 underline underline-offset-4 cursor-pointer">
              Login with Email
            </p>
          </div>

          {/* Terms */}
          <div className="pt-8 sm:pt-12 text-center">
            <p className="text-xs text-gray-500">
              All your personal details are safe with us.
            </p>
            <p className="text-xs pt-3 text-gray-500 px-4">
              If you continue, you are accepting{" "}
              <span className="text-blue-600">
                OLX Terms and Conditions and Privacy Policy
              </span>
            </p>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default Login;
