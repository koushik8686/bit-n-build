'use client'

import axios from 'axios'
import React, { useState } from 'react'
import Cookie from 'js-cookie'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, Plus, X } from 'lucide-react'

const MonthlyProgressReport = ({ progress }) => {
  const [monthlyData, setMonthlyData] = useState(progress)
  const [formVisible, setFormVisible] = useState(false)
  const [month, setMonth] = useState('')
  const [milestones, setMilestones] = useState('')
  const [issues, setIssues] = useState('')
  const [financials, setFinancials] = useState({ revenue: '', expenses: '' })
  const [expandedReport, setExpandedReport] = useState(null)
  const startup = Cookie.get('startup')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`/submit/reports/${startup}`, { month, milestones, issues, financials })
      console.log(response)
      setMonthlyData([...monthlyData, { month, milestones, issues, financials }])
      setFormVisible(false)
      resetForm()
    } catch (error) {
      console.error('Error submitting report:', error)
    }
  }

  const resetForm = () => {
    setMonth('')
    setMilestones('')
    setIssues('')
    setFinancials({ revenue: '', expenses: '' })
  }

  return (
    <div className="bg-gradient-to-br from-teal-50 to-teal-100 shadow-lg rounded-xl p-8 mb-6">
      <h2 className="text-3xl font-bold mb-6 text-teal-800">Monthly Progress Report</h2>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setFormVisible(!formVisible)}
        className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-300 mb-6 flex items-center"
      >
        {formVisible ? <X className="mr-2" /> : <Plus className="mr-2" />}
        {formVisible ? 'Cancel' : 'New Monthly Report'}
      </motion.button>
      <AnimatePresence>
        {formVisible && (
          <motion.form
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
            className="mb-8 bg-white p-6 rounded-lg shadow-md"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                placeholder="Month"
                required
                className="border border-teal-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="number"
                value={financials.revenue}
                onChange={(e) => setFinancials({ ...financials, revenue: e.target.value })}
                placeholder="Revenue"
                className="border border-teal-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="number"
                value={financials.expenses}
                onChange={(e) => setFinancials({ ...financials, expenses: e.target.value })}
                placeholder="Expenses"
                className="border border-teal-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <textarea
              value={milestones}
              onChange={(e) => setMilestones(e.target.value)}
              placeholder="Milestones Achieved"
              required
              className="w-full mt-4 border border-teal-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              rows={3}
            />
            <textarea
              value={issues}
              onChange={(e) => setIssues(e.target.value)}
              placeholder="Issues Faced"
              required
              className="w-full mt-4 border border-teal-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              rows={3}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="mt-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-300"
            >
              Submit Report
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
      <h3 className="text-2xl font-semibold mb-4 text-teal-800">Submitted Monthly Reports:</h3>
      <motion.ul className="space-y-4">
        <AnimatePresence>
          {monthlyData.map((data, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <motion.div
                className="p-4 cursor-pointer flex justify-between items-center"
                onClick={() => setExpandedReport(expandedReport === index ? null : index)}
              >
                <h4 className="text-lg font-semibold text-teal-700">{data.month}</h4>
                {expandedReport === index ? (
                  <ChevronUp className="text-teal-500" />
                ) : (
                  <ChevronDown className="text-teal-500" />
                )}
              </motion.div>
              <AnimatePresence>
                {expandedReport === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-4 pb-4"
                  >
                    <p className="mb-2">
                      <strong className="text-teal-600">Milestones:</strong> {data.milestones}
                    </p>
                    <p className="mb-2">
                      <strong className="text-teal-600">Issues:</strong> {data.issues}
                    </p>
                    <p className="mb-2">
                      <strong className="text-teal-600">Revenue:</strong> ${data.financials.revenue}
                    </p>
                    <p>
                      <strong className="text-teal-600">Expenses:</strong> ${data.financials.expenses}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  )
}

export default MonthlyProgressReport