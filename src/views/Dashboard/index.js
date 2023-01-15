import EventBus from "eventing-bus";
import { connect } from 'react-redux';
import ReactTable from 'react-table-6';
import Button from '@material-ui/core/Button';
import React, { Fragment } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Modal, ModalHeader, ModalBody } from "reactstrap";

import './index.css';
import { getListData, toggleCreateModal, sendRewards, setLoader } from '../../store/actions/Auth';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rewards: '',
            rewardsData: [],
            firstPosition: '',
            secondPosition: '',
            thirdPosition: '',
        };
        props.getListData();
    };

    componentWillReceiveProps({ rewardsData, isRewardModal }) {
        this.setState({ rewardsData });
        if (rewardsData.length > 0) {
            rewardsData.map(data => {
                if (data['position'] == 1) this.setState({ firstPosition: data['userId']['publicAddress'].toLowerCase() });
                else if (data['position'] == 2) this.setState({ secondPosition: data['userId']['publicAddress'].toLowerCase() });
                else this.setState({ thirdPosition: data['userId']['publicAddress'].toLowerCase() });
            });
        }
        if (!isRewardModal) this.setState({ rewards: '' });
    };

    copied = () => EventBus.publish("success", 'Player Address Copied');
    handleEditChange = (e) => this.setState({ [e.target.name]: e.target.value });

    // sendRewards = async () => {
    //     let { publicAddress } = this.props;
    //     let { rewards, firstPosition, secondPosition, thirdPosition } = this.state;

    //     if (rewards == '') return EventBus.publish("error", "Please enter the Rewards");
    //     if (firstPosition == '') return EventBus.publish("error", "First Position is not defined");
    //     if (secondPosition == '') return EventBus.publish("error", "Second Position is not defined");
    //     if (thirdPosition == '') return EventBus.publish("error", "Third Position is not defined");
    //     if (publicAddress == null || publicAddress == "") return EventBus.publish("error", "Please Connect Your Wallet");
    //     publicAddress = await publicAddress.toLowerCase();

    //     try {
    //         let value = await web3.utils.toWei(rewards.toString());
    //         let balance = await Token.methods.balanceOf(publicAddress).call();
    //         balance = await Number(web3.utils.fromWei(balance));
    //         if (Number(rewards) > balance) return EventBus.publish("error", "You have insufficient balance");

    //         this.props.setLoader({ message: 'Transaction In Progress...', status: true });

    //         /** Approve Transaction */
    //         await web3.eth.sendTransaction({
    //             from: publicAddress,
    //             to: TokenAddress,
    //             value: 0,
    //             // gasPrice: web3.utils.toHex(web3.utils.toWei('5', 'gwei')),
    //             data: Token.methods.approve(RewardAddress, value).encodeABI(),
    //         }).on('transactionHash', (hash) => console.log(`*******hash = `, hash));

    //         /** Send Rewards Transaction */
    //         await web3.eth.sendTransaction({
    //             from: publicAddress,
    //             to: RewardAddress,
    //             value: 0,
    //             data: Reward.methods.distributeTokens(value, firstPosition, secondPosition, thirdPosition).encodeABI(),
    //         }).on('transactionHash', (hash) => console.log(`*******hash = `, hash))
    //             .on('receipt', async (receipt) => {
    //                 let data = await {
    //                     first: firstPosition,
    //                     second: secondPosition,
    //                     third: thirdPosition,
    //                     amountOfTokens: rewards,
    //                     txHash: receipt['transactionHash']
    //                 }
    //                 this.props.sendRewards(data);
    //                 this.props.setLoader({ message: 'Rewards Send Successfully...', status: false });
    //             });
    //     } catch (e) {
    //         console.log('********Error = ', e);
    //         this.props.toggleCreateModal(false);
    //         this.props.setLoader({ message: "Rewards not send... please try again", status: false });
    //         EventBus.publish('error', `Unable to send rewards`);
    //     };
    // };


    render() {
        let { isRewardModal } = this.props;
        let { rewardsData, rewards } = this.state;

        const columns = [
            {
                id: 'player',
                Header: 'Player',
                accessor: rewardsData => rewardsData['userId']['publicAddress']
                    ? <CopyToClipboard onCopy={this.copied} text={rewardsData['userId']['publicAddress']}>
                        <button className="player-address">
                            {rewardsData['userId']['publicAddress'] && rewardsData['userId']['publicAddress'].substring(0, 8) + '.....' + rewardsData['userId']['publicAddress'].substring(34, rewardsData['userId']['publicAddress'].length)}
                        </button>
                    </CopyToClipboard>
                    : '-',
            },
            {
                id: 'score',
                Header: 'Score',
                accessor: rewardsData => rewardsData['score'] ? rewardsData['score'] : '-',
            },
            {
                id: 'position',
                Header: 'Position',
                accessor: rewardsData => rewardsData['position'] ? rewardsData['position'] : '-',
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
                                data={rewardsData}
                                columns={columns}
                                filterable={true}
                                resolveData={rewardsData => rewardsData.map(row => row)}
                            />
                        </div>
                    </Fragment>
                </div>

                {/* ---------------REWARDS MODAL--------------- */}

                <Modal isOpen={isRewardModal} toggle={() => this.props.toggleCreateModal(false)} className="main-modal reward-modal">
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
                </Modal>

            </div>
        );
    }
}

const mapDispatchToProps = {
    getListData, toggleCreateModal, sendRewards, setLoader
};

const mapStateToProps = ({ Auth }) => {
    let { publicAddress, rewardsData, isRewardModal } = Auth;
    return { publicAddress, rewardsData, isRewardModal };
};
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);