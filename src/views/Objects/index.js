import moment from 'moment';
import { connect } from 'react-redux';
import ReactTable from 'react-table-6';
import React, { Fragment } from 'react';
import { Modal, ModalHeader, ModalBody } from "reactstrap";

import './index.css';
import { getAllSchemas, toggleCreateModal, getSchemaObjects } from '../../store/actions/Auth';

class Objects extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allSchemas: [],
            selectedSchema: {},
            properties: [],
            isPropertiesModal: false,
        };
        props.getAllSchemas();
    };

    componentWillReceiveProps({ allSchemas }) {
        this.setState({ allSchemas, selectedSchema: allSchemas && allSchemas.length > 0 ? allSchemas[0] : {} }, () => {
            if (this.state.selectedSchema['objectTypeId'])
                this.props.getSchemaObjects(this.state.selectedSchema['objectTypeId'])
        });
    };

    handleEditChange = (e) => this.setState({ [e.target.name]: e.target.value });

    showPropertiesModal = (properties) => this.setState({ properties }, this.setState({ isPropertiesModal: true }));
    hidePropertiesModal = () => this.setState({ properties: [] }, this.setState({ isPropertiesModal: false }));

    render() {
        let { isRewardModal } = this.props;
        let { allSchemas, selectedSchema, isPropertiesModal } = this.state;

        console.log("********selectedSchema::", selectedSchema);

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

        return (
            <div className='content'>
                <div className="main-container player-scores">
                    <div className='main-container-head mb-3'>
                        <p className="main-container-heading">Select Schema</p>
                        {allSchemas && allSchemas.length > 0 && allSchemas.map(data => {
                            return <button className={`btn ${data['labels']['plural'] == selectedSchema['labels']['plural'] && 'btn-success'} px-2`}>{data['labels']['plural']}</button>
                        })}
                    </div>
                    <div className='main-container-head mb-3'>
                        <p className="main-container-heading">{selectedSchema['labels'] ? `All Objects of ${selectedSchema['labels']['plural']}` : 'No Schema Available'}</p>
                        <button onClick={() => this.props.toggleCreateModal(true)} className="add-btn">Create Object</button>
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
            </div>
        );
    }
}

const mapDispatchToProps = {
    getAllSchemas, toggleCreateModal, getSchemaObjects
};

const mapStateToProps = ({ Auth }) => {
    let { allSchemas } = Auth;
    return { allSchemas };
};
export default connect(mapStateToProps, mapDispatchToProps)(Objects);