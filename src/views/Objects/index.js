import { connect } from 'react-redux';
import ReactTable from 'react-table-6';
import React, { Fragment } from 'react';
import Button from '@material-ui/core/Button';
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

import './index.css';
import { getAllSchemas, getSchemaObjects, addNewObject, editObject } from '../../store/actions/Auth';

class Objects extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allSchemas: [],
            selectedSchema: {},

            allObjects: [],

            newObjectFormData: {},
            isNewObjectModal: false,

            editObjectId: {},
            editObjectFormData: {},
            isEditObjectModal: false,
        };
        props.getAllSchemas();
    };

    /* All updated props will be received */
    componentWillReceiveProps({ allSchemas, allObjects }) {
        if (this.state.allSchemas.length == 0)
            this.setState({ allSchemas, selectedSchema: allSchemas && allSchemas.length > 0 ? allSchemas[0] : {} }, () =>
                this.changeSelectedSchema(this.state.selectedSchema));

        let resultAllObjects = [];
        if (allObjects.length > 0)
            allObjects.forEach(object => {
                let newObj = {};
                Object.keys(object['properties']).forEach(key => 
                    { if (object['properties'][key]) newObj[key] = object['properties'][key] });
                resultAllObjects.push(newObj);
            });

        this.setState({ allObjects: resultAllObjects });
    };

    /* Get Object for the Schema */
    changeSelectedSchema = (selectedSchema) => {
        let params = '', search = selectedSchema['objectTypeId'];
        selectedSchema.properties.forEach(property => 
            params = params.concat(`${property['name']},`));

        if (params) search = search.concat(`?properties=${params}`);

        this.props.getSchemaObjects(search);
        this.setState({ selectedSchema });
    }


    /* Add NEW OBJECT */
    handleAddChange = (e) => {
        let { newObjectFormData } = this.state;
        newObjectFormData[e.target.name] = e.target.value;
        this.setState({ newObjectFormData });
    }
    newObjectModal = () => this.setState({ isNewObjectModal: !this.state.isNewObjectModal });
    submitNewObject = () => {
        let { newObjectFormData, selectedSchema } = this.state;

        this.newObjectModal();
        this.setState({ newObjectFormData: {} });
        this.props.addNewObject({ properties: newObjectFormData }, selectedSchema['objectTypeId']);

        setTimeout(() => this.changeSelectedSchema(selectedSchema), 500);
    }


    /* EDIT NEW OBJECT */
    editObject = (object) => {
        this.editObjectModal();
        this.setState({ editObjectFormData: object });
    }
    handleEditChange = (e) => {
        let { editObjectFormData } = this.state;
        editObjectFormData[e.target.name] = e.target.value;
        this.setState({ editObjectFormData });
    }
    editObjectModal = () => this.setState({ isEditObjectModal: !this.state.isEditObjectModal });
    submitEditObject = () => {
        let properties = {};
        let { editObjectFormData, selectedSchema } = this.state;

        Object.keys(editObjectFormData).map(key=>{
            if(key.indexOf('hs') < 0) properties[key] = editObjectFormData[key];
        });

        this.editObjectModal();
        this.setState({ editObjectFormData: {} });
        this.props.editObject({ properties }, `${selectedSchema['objectTypeId']}/${editObjectFormData['hs_object_id']}`);

        setTimeout(() => this.changeSelectedSchema(selectedSchema), 500);
    }


    render() {
        let { allSchemas, selectedSchema, allObjects, isNewObjectModal, newObjectFormData, isEditObjectModal, editObjectFormData } = this.state;
        let { properties } = selectedSchema;

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
            accessor: allObjects => <button className="view-btn" onClick={() => this.editObject(allObjects)}>
                Edit Object
            </button>
        });

        return (
            <div className='content'>
                <div className="main-container player-scores">
                    <div className='main-container-head mb-3'>
                        <p className="main-container-heading">Select Schema</p>
                        {selectedSchema['labels'] && allSchemas.map(data => {
                            return <button onClick={() => this.changeSelectedSchema(data)} className={`btn ${data['labels']['plural'] == selectedSchema['labels']['plural'] && 'btn-success'} px-2`}>{data['labels']['plural']}</button>
                        })}
                    </div>
                    <div className='main-container-head mb-3'>
                        <p className="main-container-heading">{selectedSchema['labels'] ? `All Objects of ${selectedSchema['labels']['plural']}` : 'No Schema Available'}</p>
                        <button onClick={() => this.newObjectModal()} className="add-btn">Add New Object</button>
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


                {/* ---------------ADD OBJECT MODAL--------------- */}
                <Modal isOpen={isNewObjectModal} toggle={() => this.newObjectModal()} className="main-modal add-modal">
                    <ModalHeader toggle={() => this.newObjectModal()}>
                        <div className="add-modal-title"><p className=''>Properties</p></div>
                        <div className="add-modal-line"><hr /></div>
                    </ModalHeader>
                    <ModalBody className="modal-body add-modal-body">
                        <ValidatorForm className="form" onSubmit={this.submitNewObject}>
                            {properties && properties.length > 0 && properties.map(property => {
                                if (property['type'] == 'string' && property['name'].indexOf('unique') < 0)
                                    return (
                                        <div className="row">
                                            <div className="offset-md-2 col-md-8">
                                                <TextValidator
                                                    fullWidth
                                                    margin="normal"
                                                    value={newObjectFormData[property['name']]}
                                                    name={property['name']}
                                                    variant="outlined"
                                                    className="form-input"
                                                    label={property['name']}
                                                    helper
                                                    onChange={(e) => this.handleAddChange(e)}
                                                />
                                            </div>
                                        </div>
                                    )
                            })}

                            <div className="col-12 mt-5 d-flex justify-content-around">
                                <Button className="cancel-btn col-4" type='button' onClick={() => this.newObjectModal()}>Cancel</Button>
                                <Button className="add-btn col-4" type='submit'>Add Object</Button>
                            </div>
                        </ValidatorForm>
                    </ModalBody>
                </Modal>


                {/* ---------------EDIT OBJECT MODAL--------------- */}
                <Modal isOpen={isEditObjectModal} toggle={() => this.editObjectModal()} className="main-modal add-modal">
                    <ModalHeader toggle={() => this.editObjectModal()}>
                        <div className="add-modal-title"><p className=''>Edit Properties</p></div>
                        <div className="add-modal-line"><hr /></div>
                    </ModalHeader>
                    <ModalBody className="modal-body add-modal-body">
                        <ValidatorForm className="form" onSubmit={this.submitEditObject}>
                            {editObjectFormData && Object.keys(editObjectFormData).map(key => {
                                if (key.indexOf('hs') < 0)
                                    return (
                                        <div className="row">
                                            <div className="offset-md-2 col-md-8">
                                                <TextValidator
                                                    fullWidth
                                                    margin="normal"
                                                    value={editObjectFormData[key]}
                                                    name={key}
                                                    variant="outlined"
                                                    className="form-input"
                                                    label={key}
                                                    helper
                                                    onChange={(e) => this.handleEditChange(e)}
                                                />
                                            </div>
                                        </div>
                                    )
                            })}

                            <div className="col-12 mt-3 d-flex justify-content-around">
                                <Button className="cancel-btn col-4" type='button' onClick={() => this.editObjectModal()}>Cancel</Button>
                                <Button className="add-btn col-4" type='submit'>Edit Object</Button>
                            </div>
                        </ValidatorForm>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

const mapDispatchToProps = {
    getAllSchemas, getSchemaObjects, addNewObject, editObject
};

const mapStateToProps = ({ Auth }) => {
    let { allSchemas, allObjects } = Auth;
    return { allSchemas, allObjects };
};
export default connect(mapStateToProps, mapDispatchToProps)(Objects);