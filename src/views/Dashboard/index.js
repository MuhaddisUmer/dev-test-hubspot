import moment from 'moment';
import EventBus from "eventing-bus";
import { connect } from 'react-redux';
import ReactTable from 'react-table-6';
import React, { Fragment } from 'react';
import Button from '@material-ui/core/Button';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Modal, ModalHeader, ModalBody } from "reactstrap";

import './index.css';
import { getListData, toggleCreateModal, sendRewards, setLoader } from '../../store/actions/Auth';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listData: [],
            properties: [],
            isPropertiesModal: false,
        };
        props.getListData();
    };

    componentWillReceiveProps({ listData, isRewardModal }) {
        this.setState({ listData });
        // if (!isRewardModal) this.setState({ });
    };

    copied = () => EventBus.publish("success", 'Player Address Copied');
    handleEditChange = (e) => this.setState({ [e.target.name]: e.target.value });

    showPropertiesModal = (properties) => this.setState({ properties }, this.setState({ isPropertiesModal: true }));
    hidePropertiesModal = () => this.setState({ properties: [] }, this.setState({ isPropertiesModal: false }));

    render() {
        let { isRewardModal } = this.props;
        let { listData, properties, isPropertiesModal } = this.state;

        console.log("********properties::", properties);

        const columns = [
            // {
            //     id: 'player',
            //     Header: 'Player',
            //     accessor: listData => listData['userId']['publicAddress']
            //         ? <CopyToClipboard onCopy={this.copied} text={listData['userId']['publicAddress']}>
            //             <button className="player-address">
            //                 {listData['userId']['publicAddress'] && listData['userId']['publicAddress'].substring(0, 8) + '.....' + listData['userId']['publicAddress'].substring(34, listData['userId']['publicAddress'].length)}
            //             </button>
            //         </CopyToClipboard>
            //         : '-',
            // },
            {
                id: 'id',
                Header: 'ID',
                accessor: listData => listData['id'] ? listData['id'] : '-',
            },
            {
                id: 'name',
                Header: 'Name',
                accessor: listData => listData['name'] ? listData['name'] : '-',
            },
            {
                id: 'labels',
                Header: 'Label',
                accessor: listData => listData['labels'] ? listData['labels']['singular'] : '-',
            },
            {
                id: 'createdAt',
                Header: 'Created Date',
                accessor: listData => listData['createdAt'] ? moment(listData['createdAt']).format('ll') : '-',
            }, {
                id: 'updatedAt',
                Header: 'Name',
                accessor: listData => listData['updatedAt'] ? moment(listData['updatedAt']).format('ll') : '-',
            },
            {
                id: 'Action',
                // Header: 'Player',
                accessor: listData => listData['properties']
                    ? <button className="view-btn" onClick={() => this.showPropertiesModal(listData['properties'])}>
                        View More
                    </button>
                    : '-',
            },

        ];

        return (
            <div className='content'>
                <div className="main-container player-scores">
                    <div className='main-container-head mb-3'>
                        <p className="main-container-heading">Dashboard</p>
                        <button onClick={() => this.props.toggleCreateModal(true)} className="add-btn">Create Schema</button>
                    </div>
                    <Fragment>
                        <div className='main-container-head mb-3'>
                            <ReactTable
                                minRows={20}
                                className="table"
                                data={listData}
                                columns={columns}
                                filterable={true}
                                resolveData={listData => listData.map(row => row)}
                            />
                        </div>
                    </Fragment>
                </div>

                {/* ---------------PROPERTIES MODAL--------------- */}

                <Modal isOpen={true} toggle={() => this.hidePropertiesModal()} className="main-modal properties-modal">
                    <ModalHeader toggle={() => this.hidePropertiesModal()}>
                        {/* <div className="reward-modal-logo">
                            <img src={require('../../assets/img/logo.png')} alt="modal-logo" />
                        </div> */}
                        <div className="properties-modal-title"><p className=''>Properties</p></div>
                        <div className="properties-modal-line"><hr /></div>
                    </ModalHeader>
                    <ModalBody className="modal-body properties-modal-body">
                            <div className='edit-add'>
                                <div className="view-data row">
                                    <div className="view-data-body col-md-12">
                                        <div className="view-data-row my-2">
                                            <p className="text-dark text-left pl-2"><span className="view-data-title">properties:</span> 123</p>
                                        </div>
                                        <div className="view-data-row my-2 ml-5">
                                            <p className="text-dark text-left pl-2"><span className="view-data-title">properties:</span> 123</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    </ModalBody>
                </Modal>

                {/* ---------------REWARDS MODAL--------------- */}

                {/* <Modal isOpen={isRewardModal} toggle={() => this.props.toggleCreateModal(false)} className="main-modal reward-modal">
                    <ModalHeader toggle={() => this.props.toggleCreateModal(false)}>
                        <div className="reward-modal-logo">
                            <img src={require('../../assets/img/logo.png')} alt="modal-logo" />
                        </div>
                        <div className="reward-modal-title"><p className=''>Create Schema</p></div>
                        <div className="reward-modal-line"><hr /></div>
                    </ModalHeader>
                    <ModalBody className="modal-body reward-modal-body">
                        <div className="row">
                            <div className="col-2"></div>
                            <div className="col-8">
                                <input
                                    type="number"
                                    name='rewards'
                                    value={rewards}
                                    variant="filled"
                                    className='text-field'
                                    onChange={this.handleEditChange}
                                    placeholder="Enter the amount of Rewards"
                                /> 
                            </div>
                            <div className="col-2"></div>
                            <div className="col-12 mt-5 d-flex justify-content-around">
                                <Button className="cancel-btn col-4" type='button' onClick={() => this.props.toggleCreateModal(false)}>Cancel</Button>
                                <Button className="add-btn col-4" type='button' onClick={this.sendRewards}>Send</Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal> */}

            </div>
        );
    }
}

const mapDispatchToProps = {
    getListData, toggleCreateModal, sendRewards, setLoader
};

const mapStateToProps = ({ Auth }) => {
    let { publicAddress, listData, isRewardModal } = Auth;
    return { publicAddress, listData, isRewardModal };
};
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);