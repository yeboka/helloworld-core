import './App.css'
import { Typography } from "antd";
import { Header } from "antd/es/layout/layout";
import ImageUploadModal from "./components/modal/ImageUploadModal";
import Images from "./components/Images";
import UploadButton from "./components/UploadButton";

const {Title} = Typography;

function App() {

  return (
    <div className={'flex flex-col'}>
      <Header className={'color-[#0a1521]'}>
        <Title level={3} style={{color: 'white', textAlign: 'center', lineHeight: '64px'}}>
          helloworld - core
        </Title>
      </Header>
      <div className={'w-full flex justify-center flex-1 '}>
        <div className={'flex flex-col container w-full gap-5 p-[24px]'}>
          <UploadButton/>
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
