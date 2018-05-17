<AppBar position="static" style={{backgroundColor: 'rgba(255, 251, 151, 0.70)'}}>
<Tabs style={{fontSize: 18}} centered value={value} onChange={this.handleChange} classes={{ indicator: classes.tabsIndicator }}>
<Tab value='one' label="Bookkeeping" classes={{ root: classes.tabRoot, selected: classes.tabSelected }}/>
<Tab value='two' label="Storage Unit" classes={{ root: classes.tabRoot, selected: classes.tabSelected }}/>
<Tab value='three' label="Rental Truck" classes={{ root: classes.tabRoot, selected: classes.tabSelected }}/>
<Tab value='four' label="Layout Planning" classes={{ root: classes.tabRoot, selected: classes.tabSelected }}/>
</Tabs>
</AppBar>
{value === 'one' && <TabContainer><LogTab/></TabContainer>}
{value === 'two' && <TabContainer><StorageUnitTab/></TabContainer>}
{value === 'three' && <TabContainer><RentalTruckTab/></TabContainer>}
{value === 'four' && <TabContainer><LayoutPlan/></TabContainer>}
