import { useEffect, useState } from 'react'
import Navbar from '../Navbar/Navbar'
import Login from '../Modal/Login'
import Sell from '../Modal/Sell'
import Card from '../Card/Card'
import { ItemsContext } from '../Context/Items'
import { fetchFromFirestore } from '../Firebase/Firebase'
import Footer from '../Footer/Footer'


const Home = () => {
  const [openModal, setModal] = useState(false)
  const [openModalSell, setModalSell] = useState(false)


  const toggleModal = () => { setModal(!openModal) }
  const toggleModalSell = () => { setModalSell(!openModalSell) }


  const itemsCtx = ItemsContext();

  useEffect(() => {
    if (!itemsCtx?.setItems) return;

    const getItems = async () => {
      const datas = await fetchFromFirestore();
      itemsCtx.setItems(datas);
    }

    getItems();

  }, [itemsCtx?.setItems])


  useEffect(() => {
    console.log('Updated Items:', itemsCtx.items);

  }, [itemsCtx.items])


  return (
    <div>
      <Navbar toggleModal={toggleModal} toggleModalSell={toggleModalSell} />
      <Login toggleModal={toggleModal} status={openModal} />
      <Sell setItems={itemsCtx?.setItems} toggleModalSell={toggleModalSell} status={openModalSell} />
      <Card items={itemsCtx?.items || []} />
      <Footer toggleModal={toggleModal} toggleModalSell={toggleModalSell}/>
    </div>
  )
}

export default Home
