import moment from 'moment';
import EventBus from "eventing-bus";
import { connect } from 'react-redux';
import ReactTable from 'react-table-6';
import React, { Fragment } from 'react';
import Button from '@material-ui/core/Button';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Modal, ModalHeader, ModalBody } from "reactstrap";

import './index.css';
import { getAllSchemas, getSingleSchemas, toggleCreateModal, sendRewards, setLoader } from '../../store/actions/Auth';

class Schemas extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allSchemas: [],
            properties: [],
            isPropertiesModal: false,
        };
        props.getAllSchemas();
    };

    componentWillReceiveProps({ allSchemas, singleSchema }) {
        this.setState({ allSchemas });
        if (singleSchema['properties'])
            this.setState({ properties: singleSchema['properties'] }, () => this.setState({ isPropertiesModal: true }));
    };

    copied = () => EventBus.publish("success", 'Player Address Copied');
    handleEditChange = (e) => this.setState({ [e.target.name]: e.target.value });

    singleSchema = (id) => this.props.getSingleSchemas(id);
    togglePropertiesModal = () => this.setState({ isPropertiesModal: false }, () => this.setState({ properties: [] }));

    render() {
        let { allSchemas, properties, isPropertiesModal } = this.state;

        const schemaColumns = [
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
                accessor: allSchemas => allSchemas['objectTypeId']
                    ? <button className="view-btn" onClick={() => this.singleSchema(allSchemas['objectTypeId'])}>
                        View More
                    </button>
                    : '-',
            },
        ];

        const propertiesColumns = [
            {
                id: 'name',
                Header: 'Name',
                accessor: listData => listData['name'] ? listData['name'] : '-',
            },
            {
                id: 'label',
                Header: 'Label',
                accessor: listData => listData['label'] ? listData['label'] : '-',
            },
            {
                id: 'type',
                Header: 'Type',
                accessor: listData => listData['type'] ? listData['type'] : '-',
            },
            {
                id: 'fieldType',
                Header: 'Field Type',
                accessor: listData => listData['fieldType'] ? listData['fieldType'] : '-',
            },
        ];

        return (
            <div className='content'>
                <div className="main-container player-scores">
                    <div className='main-container-head mb-3'>
                        <p className="main-container-heading">All Schemas</p>
                        <button onClick={() => this.props.toggleCreateModal(true)} className="add-btn">Create Schema</button>
                    </div>
                    <Fragment>
                        <div className='main-container-head mb-3'>
                            <ReactTable
                                minRows={20}
                                className="table"
                                data={allSchemas}
                                columns={schemaColumns}
                                filterable={true}
                                resolveData={allSchemas => allSchemas.map(row => row)}
                            />
                        </div>
                    </Fragment>
                </div>

                {/* ---------------PROPERTIES MODAL--------------- */}

                <Modal isOpen={isPropertiesModal} toggle={() => this.togglePropertiesModal()} className="main-modal properties-modal">
                    <ModalHeader toggle={() => this.togglePropertiesModal()}>
                        <div className="properties-modal-title"><p className=''>Properties</p></div>
                        <div className="properties-modal-line"><hr /></div>
                    </ModalHeader>
                    <ModalBody className="modal-body properties-modal-body">
                        <div className='main-container-head mb-3'>
                            <ReactTable
                                minRows={10}
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
    getAllSchemas, getSingleSchemas, toggleCreateModal, sendRewards, setLoader
};

const mapStateToProps = ({ Auth }) => {
    let { allSchemas, singleSchema, isRewardModal } = Auth;
    return { allSchemas, singleSchema, isRewardModal };
};
export default connect(mapStateToProps, mapDispatchToProps)(Schemas);