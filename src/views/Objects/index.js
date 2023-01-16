import moment from 'moment';
import { connect } from 'react-redux';
import ReactTable from 'react-table-6';
import React, { Fragment } from 'react';
import { Modal, ModalHeader, ModalBody } from "reactstrap";

import './index.css';
import { getAllSchemas, getSchemaObjects } from '../../store/actions/Auth';

class Objects extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allSchemas: [],
            selectedSchema: {},

            properties: [],
            isPropertiesModal: false,

            allObjects: [],
        };
        props.getAllSchemas();
    };

    componentWillReceiveProps({ allSchemas, allObjects }) {
        if (this.state.allSchemas.length == 0)
            this.setState({ allSchemas, selectedSchema: allSchemas && allSchemas.length > 0 ? allSchemas[0] : {} }, () => {
                if (this.state.selectedSchema['objectTypeId']) {
                    let params = '', search = this.state.selectedSchema['objectTypeId'];
                    this.state.selectedSchema.properties.forEach(property => params = params.concat(`${property['name']},`));
                    if (params) search = search.concat(`?properties=${params}`)
                    this.props.getSchemaObjects(search)
                }
            });

        let resultAllObjects = [];
        if (allObjects.length > 0) {
            allObjects.forEach(object => {
                let newObj = {};
                Object.keys(object['properties']).forEach(key => {
                    if (object['properties'][key]) newObj[key] = object['properties'][key]
                })
                resultAllObjects.push(newObj);
            })
        }
        this.setState({ allObjects: resultAllObjects });
    };

    handleEditChange = (e) => this.setState({ [e.target.name]: e.target.value });

    showEditObjectModal = (objectId) => {
        console.log('******** objectId = ', objectId);
        // this.setState({ properties }, this.setState({ isPropertiesModal: true }));
    }
    hidePropertiesModal = () => this.setState({ properties: [] }, this.setState({ isPropertiesModal: false }));

    render() {
        let { allSchemas, selectedSchema, allObjects } = this.state;

        let keys = [];
        let dynamicColumns = [];
        if (allObjects.length > 0) keys = Object.keys(allObjects[0]);
        keys.forEach(key => {
            dynamicColumns.push({
                id: key,
                Header: key,
                accessor: allObjects => allObjects[key] ? allObjects[key] : '-',
            })
        });
        dynamicColumns.push({
            id: 'Action',
            accessor: allObjects => <button className="view-btn" onClick={() => this.showEditObjectModal(allObjects['hs_object_id'])}>
                    Edit Object
                </button>
        })

        return (
            <div className='content'>
                <div className="main-container player-scores">
                    <div className='main-container-head mb-3'>
                        <p className="main-container-heading">Select Schema</p>
                        {selectedSchema['labels'] && allSchemas.map(data => {
                            return <button className={`btn ${data['labels']['plural'] == selectedSchema['labels']['plural'] && 'btn-success'} px-2`}>{data['labels']['plural']}</button>
                        })}
                    </div>
                    <div className='main-container-head mb-3'>
                        <p className="main-container-heading">{selectedSchema['labels'] ? `All Objects of ${selectedSchema['labels']['plural']}` : 'No Schema Available'}</p>
                        <button onClick={() => this.props.toggleCreateModal(true)} className="add-btn">Add New Object</button>
                    </div>
                    <Fragment>
                        <div className='main-container-head mb-3'>
                            <ReactTable
                                minRows={20}
                                className="table"
                                data={allObjects}
                                columns={dynamicColumns}
                                filterable={true}
                                resolveData={allObjects => allObjects.map(row => row)}
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
    getAllSchemas, getSchemaObjects
};

const mapStateToProps = ({ Auth }) => {
    let { allSchemas, allObjects } = Auth;
    return { allSchemas, allObjects };
};
export default connect(mapStateToProps, mapDispatchToProps)(Objects);