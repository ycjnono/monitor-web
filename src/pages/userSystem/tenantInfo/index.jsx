/* eslint-disable */
import { Component } from 'react'
import {Card, Button, Select, Space, Popconfirm, message, Input, Modal, DatePicker} from 'antd'
import { pageTenant,saveTenant } from '@/api/tenantApi'
const { Option } = Select
import { SearchOutlined } from '@ant-design/icons'
import StandardTable from '@/components/StandardTable/index'
import { DatePickerProps, RangePickerProps } from 'antd/es/date-picker';
import './style.less'
import TextArea from "antd/es/input/TextArea";
import IF from "@/components/IF/index";

export default class tableContainer extends Component {
  state = {
    deleteLoading: false,
    loading: false,
    selectedRowKeys: [],
    currentEdit: {},
    editShow: false,
    showCreateModal: false,
    name:'',
    managePhoneNumber:'',
    manageEmail:'',
    desc:'',
    expiredTime:'',
    status:''
  }
  selectValue = []
  filterList = {
    pageNo: 0,
    pageSize: 15,
    total: 0,
    status: '',
    name:''
  }



  statusOption = [
    {
      key: '',
      label: '全部'
    },
    {
      key: 'UnActive',
      label: '未激活'
    },
    {
      key: 'Normal',
      label: '使用中'
    },
    {
      key: 'Expired',
      label: '已过期'
    },
    {
      key: 'Locked',
      label: '锁定中'
    }
  ]
  tableHead = [
    {
      title: '租户id',
      dataIndex: 'id',
      ellipsis: true,
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (text) => {
       return <Space size="middle">
          <IF if={text === 'Normal'}>
            <div className='status-name' style={{background: "green"}}>{this.getStatusName(text)}</div>
          </IF>
         <IF if={text === 'Locked'}>
           <div className='status-name' style={{background: "red"}}>{this.getStatusName(text)}</div>
         </IF>
         <IF if={text === 'UnActive'}>
           <div className='status-name' style={{background: '#d2d25c'}}>{this.getStatusName(text)}</div>
         </IF>
         <IF if={text === 'Expired'}>
           <div className='status-name' style={{background: '#d2d25c'}}>{this.getStatusName(text)}</div>
         </IF>
        </Space>
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      ellipsis: true,
    },
    {
      title: '有效期',
      dataIndex: 'expiredTime',
      ellipsis: true,
    },
    {
      title: '手机号',
      dataIndex: 'managePhoneNumber',
      ellipsis: true,
    },
    {
      title: '操作',
      scopedSlots: { customRender: 'action' },
      width: 140,
      render: (text, record) => (
        <Space size="middle">
          <Popconfirm
            title="你确定要删除当前列吗?"
            okText="是"
            cancelText="否"
            onConfirm={() => this.handleDelete(text)}
          >
            <Button type="danger" size="small">
              删除
            </Button>
          </Popconfirm>
          <Popconfirm
              title="你确定要锁定当前列吗?"
              okText="是"
              cancelText="否"
              onConfirm={() => this.handleDelete(text)}
          >
            <Button type="danger" size="small">
              锁定
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]
  tableData = []

  componentDidMount() {
    this.getTableData()
  }

  getStatusName = (key) => {
    for (const option of this.statusOption) {
      if (option.key === key){
        return option.label
      }
    }
    return ''
  }

  getTableData = () => {
    this.setState({
      loading: true,
    })
    const { pageNo, pageSize, status, name } = this.filterList

    pageTenant({ pageNo, pageSize, status, name }).then((res) => {
      const data = res.data || {}
      this.filterList.total = data.total || 0
      this.setState({
        tableData: data.items || [],
        loading: false,
      })
    })
  }

  openCreate = () => {
    console.log('新增')
    this.setState({
      showCreateModal: true
    })
  }

  onCreateCancel = () => {
    this.setState({
      showCreateModal: false,
      name: '',
      remark: '',
      expiredTime:'',
      status:'',
      managePhoneNumber:''
    })
  }

  onCreateOk = () => {
    this.setState({
      loading: true
    })

    saveTenant({
      name: this.state.name,
      managePhoneNumber: this.state.managePhoneNumber,
      manageEmail: this.state.manageEmail,
      expiredTime: this.state.expiredTime,
      remark: this.state.remark
    })
    this.setState({
      loading: false,
      showCreateModal: false
    })
    this.getTableData()
  }

  changeCreateName = (e) => {
    this.setState({
      name: e.target.value.trim()
    })
  }

  changeCreatePhoneNumber = (e) => {
    this.setState({
      managePhoneNumber: e.target.value.trim()
    })
  }

  changeCreateEmail = (e) => {
    this.setState({
      manageEmail: e.target.value.trim()
    })
  }

  changeCreateExpiredTime = (value, dateString) => {
    this.setState({
      expiredTime: dateString
    })
  }

  changeCreateRemark = (e) => {
    this.setState({
      remark: e.target.value.trim()
    })
  }

  changeStatus = (val) => {
    this.filterList.status = val
  }

  changeName = (e) => {
    this.filterList.name = e.target.value
  }

  handleChangeCurrent = (val) => {
    this.filterList.page = val
    this.getTableData()
  }

  handleSearch = () => {
    this.filterList.page = 1
    this.getTableData()
  }

  handleSelect = (key, value) => {
    this.setState({
      selectedRowKeys: key,
    })
    this.selectValue = value
  }

  handleDelete = (val) => {
    const { id } = val
    deleteTable({ id }).then((res) => {
      this.getTableData()
      message.success('删除成功')
    })
  }

  render() {
    const {tableData, loading, selectedRowKeys} = this.state
    const {tableHead, handleSelect, filterList} = this

    return (
        <div>
          <Modal
              destroyOnClose={true}
              title={'新增租户'}
              visible={this.state.showCreateModal}
              onCancel={this.onCreateCancel}
              onOk={this.onCreateOk}
              width={600}
              closable={true}
          >
            <div className='modalLine'>
              <div className="label col-title">租户名称：<span style={{color: "red"}}>*</span>
              </div>
              <div className="label">
                <Input
                    value={this.state.name}
                    style={{width: 400}}
                    onChange={this.changeCreateName}
                />
              </div>
            </div>
            <div className='modalLine'>
              <div className="label col-title">手机号：<span style={{color: "red"}}>*</span>
              </div>
              <div className="label">
                <Input
                    value={this.state.managePhoneNumber}
                    style={{width: 400}}
                    onChange={this.changeCreatePhoneNumber}
                />
              </div>
            </div>
            <div className='modalLine'>
              <div className="label col-title">邮箱：
              </div>
              <div className="label">
                <Input
                    value={this.state.manageEmail}
                    style={{width: 400}}
                    onChange={this.changeCreateEmail}
                />
              </div>
            </div>
            <div className='modalLine'>
              <div className="label col-title">过期时间：<span style={{color: "red"}}>*</span>
              </div>
              <div className="label">
                <DatePicker showTime onChange={this.changeCreateExpiredTime} />
              </div>
            </div>
            <div className='modalLine'>
              <div className="label col-title">备注：
              </div>
              <div className="label">
                <TextArea
                    value={this.state.remark}
                    style={{width: 400}}
                    onChange={this.changeCreateRemark}
                />
              </div>
            </div>
          </Modal>
          <div className="table-wrapper">
            <Card
                title={
                  <div slot="title" className="flex flex-wrap">
                    <Button
                        type="primary"
                        style={{marginRight: '16px'}}
                        onClick={this.openCreate}
                    >
                      新增租户
                    </Button>
                    <div className="filter-wrapper" style={{margin: '0 15px'}}>
                      <span className="label">租户名称：</span>
                      <Input
                          placeholder="租户名称"
                          className="select-width"
                          onChange={this.changeName}
                      >
                      </Input>
                    </div>

                    <div className="filter-wrapper" style={{margin: '0 15px'}}>
                      <span className="label">租户状态：</span>
                      <Select
                          placeholder="租户状态"
                          className="select-width"
                          allowClear
                          onChange={this.changeStatus}
                      >
                        {this.statusOption.map((item) => {
                          return (
                              <Option key={item.key} value={item.key}>
                                {item.label}
                              </Option>
                          )
                        })}
                      </Select>
                    </div>
                    <Button
                        type="primary"
                        icon={<SearchOutlined/>}
                        style={{marginRight: '16px'}}
                        onClick={this.handleSearch}
                    >
                      查询
                    </Button>
                  </div>
                }
                hoverable={true}
                bordered={false}
            >
              <StandardTable
                  tableData={tableData}
                  tableHead={tableHead}
                  loading={loading}
                  pagination={{
                    pageSize: filterList.size,
                    current: filterList.page,
                    total: filterList.total,
                    showTotal: (total) => `${filterList.total} 条`,
                  }}
                  rowSelection={{
                    selectedRowKeys: selectedRowKeys,
                    onChange: handleSelect,
                  }}
                  changeCurrent={this.handleChangeCurrent}
              ></StandardTable>
            </Card>
          </div>
        </div>
    )
  }
}
