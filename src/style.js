const style = {
    TreeNormal: {
        border: '1px solid #f1f1f1',
        backgroundColor: '#ffffff'
    },
    TreePrereq: {
        border: '1px solid #f1f1f1',
        backgroundColor: '#DDDDDD'
    },
    TreeNode: {
        border: '1px solid #A1A1A1',
        backgroundColor: '#ffffff'
    },
    TreeNodePrereqHover: {
        border: '1px solid #A1A1A1',
        backgroundColor: '#55ff55'
    },
    TreeNodeSelected: {
        border: '1px solid #A1A1A1',
        backgroundColor: '#ff5500'
    },
    subTree: {
        border: '3px solid #f1f1f1',
        backgroundColor: '#ffffff'
    },
    parentSelectionPane: {
        display: 'show'
    },
    parentSelectionPaneHidden: {
        display: 'none'
    },
    commentBox: {
        width: '80vw',
        margin: '0 auto',
        fontFamily: 'Helvetica, sans-serif'
    },
    title: {
        textAlign: 'center',
        textTransform: 'uppercase'
    },
    commentList: {
        border: '1px solid #f1f1f1',
        padding: '0 12px',
        maxHeight: '70vh',
        overflow: 'scroll'
    },
    comment: {
        backgroundColor: '#fafafa',
        margin: '10px',
        padding: '3px 10px',
        fontSize: '.85rem'
    },
    commentForm: {
        margin: '10px',
        display: 'flex',
        flexFlow: 'row wrap',
        justifyContent: 'space-between'
    },
    commentFormAuthor: {
        minWidth: '150px',
        margin: '3px',
        padding: '0 10px',
        borderRadius: '3px',
        height: '40px',
        flex: '2'
    },
    commentFormText: {
        flex: '4',
        minWidth: '400px',
        margin: '3px',
        padding: '0 10px',
        height: '40px',
        borderRadius: '3px'
    },
    commentFormPost: {
        minWidth: '75px',
        flex: '1',
        height: '40px',
        margin: '5px 3px',
        fontSize: '1rem',
        backgroundColor: '#A3CDFD',
        borderRadius: '3px',
        color: '#fff',
        textTransform: 'uppercase',
        letterSpacing: '.055rem',
        border: 'none'
    },
    updateLink: {
        textDecoration: 'none',
        paddingRight: '15px',
        fontSize: '.7rem'
    },
    deleteLink: {
        textDecoration: 'none',
        paddingRight: '15px',
        fontSize: '.7rem',
        color: 'red'
    }
}

module.exports = style;