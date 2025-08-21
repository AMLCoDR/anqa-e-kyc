import React from 'react';

import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import numeral from 'numeral';
import { useNavigate } from 'react-router-dom';

const Nature = props => {
    const { entity, customer } = props;
    const navigate = useNavigate();

    const handleEdit = event => {
        event.preventDefault();
        navigate(`/customers/${entity.getId()}/nature`);
    }

    return (
        <Card elevation={0} data-test="business-nature">
            <CardHeader
                title="Business Nature"
                subheader="Summary of the business relationship"
                action={
                    <IconButton size="small" onClick={handleEdit} data-test="edit-nature">
                        <EditIcon fontSize="small" />
                    </IconButton>
                }
                data-ele='business-nature'
            />
            <CardContent>
                <Table size="small">
                    <TableBody>
                        <TableRow>
                            <TableCell> Countries &amp; Transactions</TableCell>
                            <TableCell align="right">
                                <NatureItem dataTest="reg-country" title="Registered in" value={customer.getRegCountry()} />
                                <NatureItem dataTest="bus-country" title="Principally trading" value={customer.getBusCountry()} />
                                <NatureItem dataTest="trade-countries" title="Trading countries"
                                    value={customer.getTradeCountries() ? customer.getTradeCountries().split(",").length : 0} />
                                <NatureItem dataTest="pay-countries" title="Payment to countries"
                                    value={customer.getPayCountries() ? customer.getPayCountries().split(",").length : 0} />
                                <NatureItem dataTest="receive-countries" title="Receipts from countries"
                                    value={customer.getReceiveCountries() ? customer.getReceiveCountries().split(",").length : 0} />
                                {(customer.getDomTransValue() > 0 || customer.getDomTransVolume() > 0) && <>
                                    <NatureItem dataTest="dom-trans-value" title="Domestic"
                                        value={customer.getDomTransVolume() + ' trans ~ ' + numeral(customer.getDomTransValue()).format('($0a)')} />
                                    <NatureItem dataTest="dom-trans-freq" title="Domestic frequency" value={customer.getDomTransFreq()} />
                                </>}
                                {(customer.getIntTransValue() > 0 || customer.getIntTransVolume() > 0) && <>
                                    <NatureItem dataTest="int-trans-value" title="International"
                                        value={customer.getIntTransVolume() + ' trans ~ ' + numeral(customer.getIntTransValue()).format('($0a)')} />
                                    <NatureItem dataTest="int-trans-freq" title="International frequency" value={customer.getIntTransFreq()} />
                                </>}
                            </TableCell>
                        </TableRow>
                        <TableRow >
                            <TableCell>Products &amp; Delivery</TableCell>
                            <TableCell align="right">
                                <NatureItem dataTest="prod-offshore" title="Used from offshore"
                                    value={customer.getProdOffshore() === true ? "Yes" : "No"} />
                                <NatureItem dataTest="third-party-operate" title="Third party operating"
                                    value={customer.getThirdPartyOperate() === true ? "Yes" : "No"} />
                                <NatureItem dataTest="third-party-receipts" title="Third party receipts"
                                    value={customer.getThirdPartyReceipts() === true ? "Yes" : "No"} />
                                <NatureItem data-test="indirect-relationships" title="Indirect relationships"
                                    value={customer.getIndirectRelationships() === true ? "Yes" : "No"} />
                                <NatureItem data-test="access-method" title="Distribution" value={customer.getAccessMethod()} />
                            </TableCell>
                        </TableRow>
                        <TableRow >
                            <TableCell>
                                Institutions
                            </TableCell>
                            <TableCell align="right">
                                <NatureItem dataTest="exposure-unregulated" title="Unregulated" value={customer.getExposureUnregulated()} />
                                <NatureItem dataTest="exposure-shell-co" title="Shell companies" value={customer.getExposureShellCo()} />
                                <NatureItem dataTest="exposure-shell-bank" title="Shell banks" value={customer.getExposureShellBank()} />
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>);
};

export default Nature;

const NatureItem = props => {
    const { dataTest, title, value } = props;

    return (
        <Box sx={{ display: "flex", justifyContent: "space-between" }} >
            <Typography component="div" variant="body2" color="textSecondary">{title}:</Typography>
            <Typography component="div" variant="body2" data-test={dataTest}>{value}</Typography>
        </Box>
    );
};