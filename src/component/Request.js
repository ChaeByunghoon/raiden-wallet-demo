import React from 'react'
import Dialog from "@material-ui/core/Dialog";
import {DialogTitle} from "@material-ui/core";
import DialogContent from "@material-ui/core/DialogContent";
import QRCode from "qrcode.react";

class Request extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            isModalOpen: false,
            isGenerateModalOpen: false,
            amount: 0
        };
    }

    render() {
        return (
            <div className="grid-double-wider">
                <button id="requestButton" onClick={this.openModal}>Request</button>
                <RequestModal open={this.state.isModalOpen}
                              closeModal={() => this.closeModal()}
                              address={this.props.address} generate={() => this.openGenerateInvoiceModal()}/>
                <GenerateInvoiceModal open={this.state.isGenerateModalOpen}
                                      closeModal={() => this.closeGenerateInvoiceModal()}
                                      amount={this.state.amount}
                                      address={this.props.address}
                                      tokenAddress={this.props.tokenAddresses} />
            </div>
        )
    }

    openModal = () => {
        this.setState({ isModalOpen: true });
    };

    closeModal = () => {
        this.setState({ isModalOpen: false });
    };

    openGenerateInvoiceModal = () => {
        this.setState({
            isModalOpen: false,
            isGenerateModalOpen: true
        });
    };

    closeGenerateInvoiceModal = () => {
        this.setState({
            isGenerateModalOpen: false
        });
    };
}

class RequestModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: props.open
        };
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    render() {
        return (
            <Dialog open={this.props.open}>
                <button className="close-button" onClick={this.props.close} >Close</button>
                <DialogTitle style={{textAlign: "center"}}>Request Payment</DialogTitle>
                <DialogContent style={{textAlign: "center"}}>
                    <div className="content qr row" style={{cursor: "pointer"}}>
                        <label htmlFor="amount_input">Request amount</label>
                        <div className="input-group">
                            <input name="amount" type="number" className="address-input" placeholder="0.00" onChange={this.handleChange}/>
                        </div>
                    </div>
                    <button id="generateButton" onClick={this.props.generate}>Generate Invoice</button>
                </DialogContent>
            </Dialog>
        );
    }

}

class GenerateInvoiceModal extends React.Component{

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {
        var Invoice = require('.././service/invoice');
        var createdInvoice = Invoice.createInvoice({
            network: 4,
            publicKey: '0xE6987CD613Dfda0995A95b3E6acBAbECecd41376',
            operatorAddress: this.props.address,
            tokenAddress: this.props.tokenAddress,
            amount: this.props.amount
        });
        var encodedInvoice = Invoice.encodeInvoice(createdInvoice);
        console.log(encodedInvoice);
        this.setState({
            encodedInvoice: encodedInvoice
        });
    }

    render() {
        let qrSize = Math.min(document.documentElement.clientWidth, 512) - 90;
        return (
            <Dialog open={this.props.open}>
                <button className="close-button" onClick={this.props.closeModal} >Close</button>
                <DialogTitle style={{textAlign: "center"}}>Invoice</DialogTitle>
                <DialogContent style={{textAlign: "center"}}>
                    <div className="content qr row" style={{cursor: "pointer"}}>
                        <QRCode value={this.state.encodedInvoice} size={qrSize}/>
                        <input type="text" style={{width: qrSize}} className="address-input" value={this.state.encodedInvoice} disabled/>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }


}

export default Request