import React from 'react';
import 'antd/dist/antd.css';
import { LoadingOutlined } from '@ant-design/icons';
import "./Spinner.scss"


const Spinner = () =>{
  return (
    <LoadingOutlined className="spinnerContainer" spin />
  )

}

export default Spinner;
