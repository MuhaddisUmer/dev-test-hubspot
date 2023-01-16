import moment from 'moment';
import EventBus from "eventing-bus";
import { connect } from 'react-redux';
import ReactTable from 'react-table-6';
import React, { Fragment } from 'react';
import Button from '@material-ui/core/Button';
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

import './index.css';
import { getAllSchemas, getSingleSchemas, createSchema, toggleCreateSchema } from '../../store/actions/Auth';

class Schemas extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allSchemas: [],
            propertiesData: [],
            isPropertiesModal: false,

            formData: {
                name: '',
                labels: {
                    singular: '',
                    plural: '',
                },
                primaryDisplayProperty: '',
                requiredProperties: [],
                properties: [],
                associatedObjects: ["CONTACT"],
                metaType: '',
            },
            singleProperty: {
                name: '',
                label: '',
                isPrimaryDisplayLabel: true,
            }
        };
        props.getAllSchemas();
    };

    componentWillReceiveProps({ allSchemas, singleSchema }) {
        this.setState({ allSchemas });
        if (singleSchema['properties'])
            this.setState({ propertiesData: singleSchema['properties'] }, () => this.setState({ isPropertiesModal: true }));
    };

    copied = () => EventBus.publish("success", 'Player Address Copied');

    handleEditChange = (e) => {
        let { formData } = this.state;

        if (e.target.name == 'singular') formData['labels']['singular'] = e.target.value;

        else if (e.target.name == 'plural') formData['labels']['plural'] = e.target.value;

        else if (e.target.name == 'requiredProperties') {
            let requiredPropertiesValue = e.target.value;
            formData['requiredProperties'] = requiredPropertiesValue.split(',');
        }

        else formData[e.target.name] = e.target.value;
        this.setState({ formData });
    };

    setSingleProperty = (e) => {
        let { singleProperty } = this.state;
        singleProperty[e.target.name] = e.target.value;
        this.setState({ singleProperty });
    };

    submitProperty = () => {
        let { singleProperty, formData } = this.state;
        if (singleProperty['name'] == '' && singleProperty['label'] == '') EventBus.publish("error", 'Please fill the properties first');
        else {
            formData['properties'].push(singleProperty);
            singleProperty = {
                name: '',
                label: '',
                isPrimaryDisplayLabel: true
            }
            this.setState({ singleProperty, formData });
        }
    };

    submitCreateSchema = () => {
        let { formData } = this.state;

        if(formData['properties'].length == 0) {
            EventBus.publish("error", 'Please add the properties by Clicking on Add Properties Button');
            return;
        };

        this.props.createSchema(formData);
        // this.props.createSchema({
        //     "name": "muhaddis_object",
        //     "labels": {
        //       "singular": "Muhaddis object",
        //       "plural": "Muhaddis objects"
        //     },
        //     "primaryDisplayProperty": "muhaddis_object_property",
        //     "requiredProperties": [
        //       "muhaddis_object_property"
        //     ],
        //     "properties": [
        //       {
        //         "name": "muhaddis_object_property",
        //         "label": "Muhaddis object property",
        //         "isPrimaryDisplayLabel": true
        //       },
        //       {
        //         "name": "muhaddis_object_age",
        //         "label": "Muhaddis object age",
        //         "isPrimaryDisplayLabel": true
        //       }
        //     ],
        //     "associatedObjects": [
        //       "CONTACT"
        //     ],
        //     "metaType": "PORTAL_SPECIFIC"
        //   });
    }

    singleSchema = (id) => this.props.getSingleSchemas(id);
    togglePropertiesModal = () => this.setState({ isPropertiesModal: false }, () => this.setState({ propertiesData: [] }));

    render() {

        let { isCreateSchema } = this.props;
        let { allSchemas, propertiesData, isPropertiesModal, singleProperty } = this.state;
        let { name, labels, primaryDisplayProperty, requiredProperties, properties, associatedObjects, metaType } = this.state.formData;

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
                        <button onClick={() => this.props.toggleCreateSchema(true)} className="add-btn">Create Schema</button>
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

                {/* ---------------CREATE SCHEMA MODAL--------------- */}

                <Modal isOpen={true} toggle={() => this.props.toggleCreateSchema(false)} className="main-modal schema-modal">
                    <ModalHeader toggle={() => this.props.toggleCreateSchema(false)}>
                        <div className="schema-modal-title"><p className=''>Create Schema</p></div>
                        <div className="schema-modal-line"><hr /></div>
                    </ModalHeader>
                    <ModalBody className="modal-body schema-modal-body">
                        <ValidatorForm className="form" onSubmit={this.submitCreateSchema}>
                            <div className="row">

                                <div className="offset-md-1 col-md-10">
                                    <TextValidator
                                        fullWidth
                                        margin="normal"
                                        value={name}
                                        name="name"
                                        variant="outlined"
                                        className="form-input"
                                        validators={['required']}
                                        label="Name"
                                        errorMessages={['Name can not be empty']}
                                        onChange={(e) => this.handleEditChange(e)}
                                    />
                                </div>

                                <div className="offset-md-1 col-md-10">
                                    <div className="col-12">
                                        <label className='label'>Labels</label>
                                    </div>
                                    <div className="offset-2 col-8">
                                        <TextValidator
                                            fullWidth
                                            margin="normal"
                                            name='singular'
                                            value={labels['singular']}
                                            variant="outlined"
                                            className="form-input"
                                            validators={['required']}
                                            label="Singular Label"
                                            errorMessages={['Singular Label can not be empty']}
                                            onChange={(e) => this.handleEditChange(e)}
                                        />
                                    </div>
                                    <div className="offset-2 col-8">
                                        <TextValidator
                                            fullWidth
                                            margin="normal"
                                            name='plural'
                                            value={labels['plural']}
                                            variant="outlined"
                                            className="form-input"
                                            validators={['required']}
                                            label="Plural Label"
                                            errorMessages={['Plural Label can not be empty']}
                                            onChange={(e) => this.handleEditChange(e)}
                                        />
                                    </div>
                                </div>

                                <div className="offset-md-1 col-md-10">
                                    <TextValidator
                                        fullWidth
                                        margin="normal"
                                        value={primaryDisplayProperty}
                                        name="primaryDisplayProperty"
                                        variant="outlined"
                                        className="form-input"
                                        validators={['required']}
                                        label="Primary Display Property here"
                                        errorMessages={['Primary Display Property can not be empty']}
                                        onChange={(e) => this.handleEditChange(e)}
                                    />
                                </div>

                                <div className="offset-md-1 col-md-10">
                                    <TextValidator
                                        fullWidth
                                        margin="normal"
                                        value={requiredProperties}
                                        name="requiredProperties"
                                        variant="outlined"
                                        className="form-input"
                                        validators={['required']}
                                        label="Required Properties"
                                        errorMessages={['Required Properties can not be empty']}
                                        onChange={(e) => this.handleEditChange(e)}
                                        helperText="Seperate the Required Properties by Comma(,) without space"
                                    />
                                </div>

                                <div className="offset-md-1 col-md-10">
                                    <div className="col-12 d-flex justify-content-between">
                                        <label className='label'>Properties</label>
                                        <a className='add-btn' onClick={this.submitProperty}>Add Properties</a>
                                    </div>
                                    <div className="offset-2 col-8">
                                        {properties.length > 0 && properties.map(property => {
                                            return (
                                                <div className='text-white'>
                                                    <strong>Name:&nbsp; </strong> {property['name']} <br />
                                                    <strong>Label:&nbsp; </strong> {property['label']}
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <div className="offset-2 col-8 mt-2">
                                        <TextValidator
                                            fullWidth
                                            margin="normal"
                                            name='name'
                                            value={singleProperty['name']}
                                            variant="outlined"
                                            className="form-input"
                                            label="Property Name"
                                            onChange={(e) => this.setSingleProperty(e)}
                                        />
                                    </div>
                                    <div className="offset-2 col-8">
                                        <TextValidator
                                            fullWidth
                                            margin="no
                                            rmal"
                                            name='label'
                                            value={singleProperty['label']}
                                            variant="outlined"
                                            className="form-input"
                                            label="Property Label"
                                            onChange={(e) => this.setSingleProperty(e)}
                                        />
                                    </div>
                                </div>

                                <div className="offset-md-1 col-md-10 mt-2">
                                    <TextValidator
                                        fullWidth
                                        margin="normal"
                                        value={metaType}
                                        name="metaType"
                                        variant="outlined"
                                        className="form-input"
                                        validators={['required']}
                                        label="Meta Type"
                                        errorMessages={['Meta Type can not be empty']}
                                        onChange={(e) => this.handleEditChange(e)}
                                    />
                                </div>


                                <div className="col-12 mt-5 d-flex justify-content-around">
                                    <Button className="cancel-btn col-4" type='button' onClick={() => this.props.toggleCreateSchema(false)}>Cancel</Button>
                                    <Button className="add-btn col-4" type='submit'>Create</Button>
                                </div>
                            </div>
                        </ValidatorForm>

                    </ModalBody>
                </Modal>

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
                                data={propertiesData}
                                columns={propertiesColumns}
                                filterable={true}
                                resolveData={propertiesData => propertiesData.map(row => row)}
                            />
                        </div>
                    </ModalBody>
                </Modal>

            </div>
        );
    }
}

const mapDispatchToProps = {
    getAllSchemas, getSingleSchemas, createSchema, toggleCreateSchema,
};

const mapStateToProps = ({ Auth }) => {
    let { allSchemas, singleSchema, isCreateSchema } = Auth;
    return { allSchemas, singleSchema, isCreateSchema };
};
export default connect(mapStateToProps, mapDispatchToProps)(Schemas);