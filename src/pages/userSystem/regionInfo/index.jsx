import { Component } from 'react'
import {Card, Button, Select, Space, Popconfirm, message, Input} from 'antd'
import { pageTenant } from '@/api/tenantApi'
const { Option } = Select
import { SearchOutlined } from '@ant-design/icons'
import StandardTable from '@/components/StandardTable/index'
import './style.less'

export default class tableContainer extends Component {
  state = {
    deleteLoading: false,
    loading: false,
    selectedRowKeys: [],
    currentEdit: {},
    editShow: false,
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
      render: (status) => this.getStatusName(status)
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
      title: '备注',
      dataIndex: 'remark',
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
    const { tableData, loading, selectedRowKeys } = this.state
    const { tableHead, handleSelect, filterList } = this

    return (
      <div className="table-wrapper">
        <Card
          title={
            <div slot="title" className="flex flex-wrap">

              <div className="filter-wrapper" style={{ margin: '0 15px' }}>
                <span className="label">租户名称：</span>
                <Input
                    placeholder="租户名称"
                    className="select-width"
                    onChange={this.changeName}
                >
                </Input>
              </div>

              <div className="filter-wrapper" style={{ margin: '0 15px' }}>
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
                icon={<SearchOutlined />}
                style={{ marginRight: '16px' }}
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
    )
  }
}
