import moment from 'moment';
import EventBus from "eventing-bus";
import { connect } from 'react-redux';
import ReactTable from 'react-table-6';
import React, { Fragment } from 'react';
import { Modal, ModalHeader, ModalBody } from "reactstrap";

import './index.css';
import { getAllSchemas, toggleCreateModal, sendRewards, setLoader } from '../../store/actions/Auth';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allSchemas: [],
            properties: [],
            isPropertiesModal: false,
        };
        props.getAllSchemas();
    };

    componentWillReceiveProps({ allSchemas, isRewardModal }) {
        this.setState({ allSchemas });
    };

    copied = () => EventBus.publish("success", 'Player Address Copied');
    handleEditChange = (e) => this.setState({ [e.target.name]: e.target.value });

    getObjectType = (id) => this.props.getSingleSchemas(id);

    render() {
        let { isRewardModal } = this.props;
        let { allSchemas, properties, isPropertiesModal } = this.state;

        console.log("********allSchemas::", allSchemas);

        const columns = [
            {
                id: 'id',
                Header: 'ID',
                accessor: allSchemas => allSchemas['id'] ? allSchemas['id'] : '-',
            },
            {
                id: 'name',
                Header: 'Name',
                accessor: allSchemas => allSchemas['name'] ? allSchemas['name'] : '-',
            },
            {
                id: 'labels',
                Header: 'Label',
                accessor: allSchemas => allSchemas['labels'] ? allSchemas['labels']['singular'] : '-',
            },
            {
                id: 'createdAt',
                Header: 'Created Date',
                accessor: allSchemas => allSchemas['createdAt'] ? moment(allSchemas['createdAt']).format('ll') : '-',
            }, {
                id: 'updatedAt',
                Header: 'Name',
                accessor: allSchemas => allSchemas['updatedAt'] ? moment(allSchemas['updatedAt']).format('ll') : '-',
            },
            {
                id: 'Action',
                // Header: 'Player',
                accessor: allSchemas => allSchemas['properties']
                    ? <button className="view-btn" onClick={() => this.showPropertiesModal(allSchemas['properties'])}>
                        View More
                    </button>
                    : '-',
            },
        ];

        const propertiesColumns = [
           
            // {
            //     id: 'id',
            //     Header: 'ID',
            //     accessor: listData => listData['id'] ? listData['id'] : '-',
            // },
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
                                data={allSchemas}
                                columns={columns}
                                filterable={true}
                                resolveData={allSchemas => allSchemas.map(row => row)}
                            />
                        </div>
                    </Fragment>
                </div>

                {/* ---------------PROPERTIES MODAL--------------- */}

                <Modal isOpen={false} toggle={() => this.hidePropertiesModal()} className="main-modal properties-modal">
                    <ModalHeader toggle={() => this.hidePropertiesModal()}>
                        <div className="properties-modal-title"><p className=''>Properties</p></div>
                        <div className="properties-modal-line"><hr /></div>
                    </ModalHeader>
                    <ModalBody className="modal-body properties-modal-body">
                    <div className='main-container-head mb-3'>
                            <ReactTable
                                minRows={30}
                                className="table"
                                data={properties}
                                columns={propertiesColumns}
                                filterable={true}
                                resolveData={properties => properties.map(row => row)}
                            />
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
    getAllSchemas, toggleCreateModal, sendRewards, setLoader
};

const mapStateToProps = ({ Auth }) => {
    let { publicAddress, allSchemas, isRewardModal } = Auth;
    return { publicAddress, allSchemas, isRewardModal };
};
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);