import { onDatePickerPage } from "../support/page_objects/datePickerPage"
import { onFormLayoutsPage } from "../support/page_objects/formLayoutsPage"
import { navigateTo } from "../support/page_objects/navigationPage"
import { onSmartTables } from "../support/page_objects/smartTablePage"

describe('Test with Page Objects', () => {

        beforeEach('open application', () => {
            cy.openHomePage()
        })

        it('verify navigation across the pages', () => {
            navigateTo.formLayoutsPage()
            navigateTo.datePickerPage()
            navigateTo.smartTables()
            navigateTo.toasterPage()
            navigateTo.toolTipPage()
        })

        it.only('should submit Inline and Basic form and select tomorrow date in the calendar', () => {
            navigateTo.formLayoutsPage()
            onFormLayoutsPage.submitInlineFormWithNameAndEmail('Natalia', 'tester@tester.com')
            onFormLayoutsPage.submitBasicFormWithEmailAndPassword('tester@tester.com', 'password')
            navigateTo.datePickerPage()
            onDatePickerPage.selectCommonDatepickerDateFromToday(1)
            onDatePickerPage.selectDatepickerWithRangeFromToday(7, 14)
            navigateTo.smartTables()
            onSmartTables.addNewRecordWithFirstAndLastName('Natalia', 'Piska')
            onSmartTables.updateAgeByFirstName('Natalia', '35')
            onSmartTables.deleteRowByIndex(1)
        })

})