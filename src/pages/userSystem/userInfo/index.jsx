import { Component } from 'react'
import {Card, Button, Select, Space, Popconfirm, message, Input, Upload } from 'antd'
import {putObject} from '@/utils/minioUtil'
const { Option } = Select
import { SearchOutlined, UploadOutlined } from '@ant-design/icons'
import StandardTable from '@/components/StandardTable/index'
import './style.less'


export default class tableContainer extends Component {

  putObject = async () => {
    const fileName = '20210202164005523.jpg'
    const filePath = 'D:\\data\\' + fileName
    await putObject(fileName, filePath)
  }

  render() {
    return <div style={{alignItems: "center"}}>
      <Upload onChange={this.putObject}>
        <Button icon={<UploadOutlined />}>Click to Upload</Button>
      </Upload>
    </div>
  }
}
