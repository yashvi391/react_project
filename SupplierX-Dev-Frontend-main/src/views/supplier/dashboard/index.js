// ** React Imports

// ** Reactstrap Imports
import { Row, Col, Card, CardHeader, CardTitle, CardBody } from 'reactstrap'

// ** Demo Components

import CardCongratulations from '@src/views/ui-elements/cards/advance/CardCongratulations'


// ** Styles
import '@styles/react/libs/charts/apex-charts.scss'

const AnalyticsDashboard = () => {
  // ** Context

  return (
    <div id='dashboard-analytics'>
      <Row className='match-height'>
        <Col lg='12' sm='12'>
          <CardCongratulations />
        </Col>
     
    
      </Row>


    </div>
  )
}

export default AnalyticsDashboard
