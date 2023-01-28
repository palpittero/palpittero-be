import { sendEmail } from './alattus.service'

import { getNewsletterHTML, getContactHTML } from './alattus.helpers'
import {
  MAIL_CHIMP_ERROR,
  MAIL_CHIMP_SUCCESS,
  CONTACT_SUCCESS,
  CONTACT_ERROR,
  NEWSLETTER_SUCCESS,
  NEWSLETTER_ERROR,
  MAIL_CHIMP_NOT_FOUND_STATUS,
  COUPON_SUCCESS,
  COUPON_ERROR,
  DISCOUNT_LINKS,
  DEFAULT_LINK
} from './alattus.constants'

import {
  getListMember,
  updateListMemberTags,
  setListMember
} from './alattus.service'

const sendContact = (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  const userAgent = req.get('User-Agent')

  sendEmail({
    from: req.body.email,
    subject: req.body.subject,
    html: getContactHTML({ ...req.body, ip, userAgent }),
    onSuccess: (info) => {
      console.log(CONTACT_SUCCESS, info)
      res.json({ success: true, message: CONTACT_SUCCESS })
    },
    onError: (error) => {
      console.log(CONTACT_ERROR, error)
      res.status(500).json({ success: false, message: CONTACT_ERROR })
    }
  })
}

const subscribeNewsletter = (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  const userAgent = req.get('User-Agent')

  sendEmail({
    from: req.body.email,
    subject: 'Newsletter - Nova Subscrição',
    html: getNewsletterHTML({ ...req.body, ip, userAgent }),
    onSuccess: (info) => {
      console.log(NEWSLETTER_SUCCESS, info)
      res.json({ success: true, message: NEWSLETTER_SUCCESS })
    },
    onError: (error) => {
      console.log(NEWSLETTER_ERROR, error)
      res.status(500).json({ success: false, message: NEWSLETTER_ERROR })
    }
  })
}

const subscribe = async (req, res, tags) => {
  const { email } = req.body

  try {
    console.log('Getting list member', email)

    await getListMember(email)

    console.log('Updating list member tags', tags)
    updateListMemberTags({ email, tags })

    console.log(MAIL_CHIMP_SUCCESS)
    return res.json({ success: true, message: MAIL_CHIMP_SUCCESS })
  } catch (error) {
    if (error.status === MAIL_CHIMP_NOT_FOUND_STATUS) {
      console.log('Member list not found', email)
      try {
        console.log('Setting list member', email, tags)
        await setListMember({ ...req.body, tags: tags.map(({ name }) => name) })

        console.log(MAIL_CHIMP_SUCCESS)
        return res.json({ success: true, message: MAIL_CHIMP_SUCCESS })
      } catch (error) {
        console.log(MAIL_CHIMP_ERROR, error)
        return res
          .status(500)
          .json({ success: false, message: MAIL_CHIMP_ERROR })
      }
    }

    console.log(MAIL_CHIMP_ERROR, error)
    return res.status(500).json({ success: false, message: MAIL_CHIMP_ERROR })
  }
}

const subscribeToFinancialSheet = async (req, res) =>
  subscribe(req, res, [{ name: 'planilhaorcamentaria', status: 'active' }])

const subscribeToInvestmentSheet = async (req, res) =>
  subscribe(req, res, [{ name: 'planilhainvestimentos', status: 'active' }])

const subscribeToMentorship = async (req, res) =>
  subscribe(req, res, [{ name: 'mentoria', status: 'active' }])

const subscribeToLiveGuide = async (req, res) =>
  subscribe(req, res, [{ name: 'guia', status: 'active' }])

const subscribeToWaitingList = async (req, res) =>
  subscribe(req, res, [{ name: 'espera', status: 'active' }])

const subscribeToFinancialCleaning = async (req, res) =>
  subscribe(req, res, [{ name: 'faxina', status: 'active' }])

const validateCoupon = (req, res) => {
  const { coupon } = req.body

  const discountLink = DISCOUNT_LINKS[coupon]

  console.log('discount link found', discountLink)
  if (discountLink) {
    res.json({ success: true, message: COUPON_SUCCESS, data: discountLink })
  } else {
    res.json({ success: false, message: COUPON_ERROR, data: DEFAULT_LINK })
  }
}

export {
  sendContact,
  subscribeNewsletter,
  subscribeToFinancialSheet,
  subscribeToInvestmentSheet,
  subscribeToMentorship,
  subscribeToLiveGuide,
  subscribeToWaitingList,
  subscribeToFinancialCleaning,
  validateCoupon
}
