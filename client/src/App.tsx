import './App.css'
import { Button, Typography } from "antd";
import { Header } from "antd/es/layout/layout";
import ImageUploadModal from "./components/modal/ImageUploadModal";
import Images from "./components/Images";
import { useImageStore } from "./store/imageStore";

const {Title} = Typography;

function App() {

  const {setIsModalOpen} = useImageStore()

  return (
    <div className={'flex flex-col'}>
      <Header className={'color-[#0a1521]'}>
        <Title level={3} style={{color: 'white', textAlign: 'center', lineHeight: '64px'}}>
          helloworld - core
        </Title>
      </Header>
      <div className={'w-full flex justify-center flex-1'}>
        <div className={'flex flex-col container w-full gap-5 p-[24px] '}>
          <Button color={"blue"} variant={"dashed"} onClick={() => setIsModalOpen(true)}>
            Загрузить изображение
          </Button>
          <ImageUploadModal/>
          <Images/>
        </div>
      </div>
      <footer style={{textAlign: 'center'}}>
        Simple S3 Uploader ©{new Date().getFullYear()} Created by You
      </footer>
    </div>
  );

}

export default App
