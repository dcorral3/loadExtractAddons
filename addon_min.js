
/* -------------------------------------------------------------------------- */
/* Copyright 2002-2017, OpenNebula Project, OpenNebula Systems                */
/*                                                                            */
/* Licensed under the Apache License, Version 2.0 (the "License"); you may    */
/* not use this file except in compliance with the License. You may obtain    */
/* a copy of the License at                                                   */
/*                                                                            */
/* http://www.apache.org/licenses/LICENSE-2.0                                 */
/*                                                                            */
/* Unless required by applicable law or agreed to in writing, software        */
/* distributed under the License is distributed on an "AS IS" BASIS,          */
/* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.   */
/* See the License for the specific language governing permissions and        */
/* limitations under the License.                                             */
/* -------------------------------------------------------------------------- */

define('addons/tabs/payments-tab/tabId',['require'],function(require){
    return 'payments-tab';
  });
/* -------------------------------------------------------------------------- */
/* Copyright 2002-2017, OpenNebula Project, OpenNebula Systems                */
/*                                                                            */
/* Licensed under the Apache License, Version 2.0 (the "License"); you may    */
/* not use this file except in compliance with the License. You may obtain    */
/* a copy of the License at                                                   */
/*                                                                            */
/* http://www.apache.org/licenses/LICENSE-2.0                                 */
/*                                                                            */
/* Unless required by applicable law or agreed to in writing, software        */
/* distributed under the License is distributed on an "AS IS" BASIS,          */
/* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.   */
/* See the License for the specific language governing permissions and        */
/* limitations under the License.                                             */
/* -------------------------------------------------------------------------- */

define('addons/tabs/payments-tab/form-panels/create/formPanelId',['require'],function(require){
    return 'createCardForm';
  });
  
/* -------------------------------------------------------------------------- */
/* Copyright 2002-2017, OpenNebula Project, OpenNebula Systems                */
/*                                                                            */
/* Licensed under the Apache License, Version 2.0 (the "License"); you may    */
/* not use this file except in compliance with the License. You may obtain    */
/* a copy of the License at                                                   */
/*                                                                            */
/* http://www.apache.org/licenses/LICENSE-2.0                                 */
/*                                                                            */
/* Unless required by applicable law or agreed to in writing, software        */
/* distributed under the License is distributed on an "AS IS" BASIS,          */
/* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.   */
/* See the License for the specific language governing permissions and        */
/* limitations under the License.                                             */
/* -------------------------------------------------------------------------- */



define('addons/tabs/payments-tab/actions',['require','utils/notifier','./tabId','./form-panels/create/formPanelId','sunstone'],function (require) {

  var Notifier = require('utils/notifier');
  var TAB_ID = require('./tabId');
  var PATH = 'billing/payments';
  var CREATE_DIALOG_ID = require('./form-panels/create/formPanelId');
  var Sunstone = require('sunstone');

  var _actions = {
    "Payments.list": {
      call: function (params) {
        $.ajax({
          url: PATH,
          type: "GET",
          dataType: "json",
          success: function (response, request) {
            response.sources.data.forEach(function (card) {
              if (card.id == response.default_source) {
                card.metadata.default = true;
              }
              else {
                if (card.metadata.default) {
                  delete card.metadata.default;
                }
              }
            })
            var datatable = Sunstone.getDataTable(TAB_ID);
            if (datatable) {
              datatable.updateView(request, response.sources.data);
            }
          },
          error: function (response) {
          }
        });
      }
    },
    "Payments.refresh": {
      type: "list",
      call: function (params) {
        $.ajax({
          url: PATH,
          type: "GET",
          dataType: "json",
          success: function (response, request) {
            response.sources.data.forEach(function (card) {
              if (card.id == response.default_source) {
                card.metadata.default = true;
              }
              else {
                if (card.metadata.default) {
                  delete card.metadata.default;
                }
              }
            })
            var datatable = Sunstone.getDataTable(TAB_ID);
            if (datatable) {
              datatable.updateView(request, response.sources.data);
            }
          },
          error: function (response) {
          }
        });
      },
    },
    "Payments.delete": {
      type: "multiple",
      call: function (params) {
        id = params.data.id
        $.ajax({
          url: PATH + "/" + id,
          type: "DELETE",
          success: function () {
            if (Sunstone.getTab() == TAB_ID) {
              Sunstone.showTab(TAB_ID);
            }
            Notifier.notifyMessage("Payment method deleted");
          },
          error: function (request, response) {
            Notifier.notifyError("Payment method not found");
          }
        });
      },
      elements: function () {
        return Sunstone.getDataTable(TAB_ID).elements({ names: false });
      }
    },
    "Payments.create_dialog": {
      call: function () {
        Sunstone.showFormPanel(TAB_ID, CREATE_DIALOG_ID, "create");
      }
    },
    "Payments.create": {
      type: "create",
      call: function (params) {
        $.ajax({
          url: PATH,
          type: "POST",
          dataType: "json",
          data: JSON.stringify(params.data),
          contentType: "application/json; charset=utf-8",
          success: function (response) {
            Sunstone.resetFormPanel(TAB_ID, CREATE_DIALOG_ID);
            Sunstone.hideFormPanel(TAB_ID);
            Notifier.notifyMessage("Payment method created");
          },
          error: function (response) {
          }
        });
      }
    },
    "Payments.show": {
      type: "single",
      call: function (params) {
        $.ajax({
          url: PATH + "/" + params.data.id,
          type: "GET",
          dataType: "json",
          data: params.data,
          success: function (response) {
            if (Sunstone.rightInfoVisible($('#' + TAB_ID))) {
              Sunstone.insertPanels(TAB_ID, response);
            }
          },
          error: function (response) {
          }
        });
      }
    },
    "Payments.rename": {
      type: "single",
      call: function (params) {
        $.ajax({
          url: PATH,
          data: params.data,
          type: "PATCH",
          success: function (req, res) {
            Sunstone.runAction("Payments.show", req.id);
            Notifier.notifyMessage("Payment method updated");
          },
          error: function (req, res) {
            Sunstone.runAction("Payments.show", req.responseJSON.card_id);
            Notifier.notifyError(req.responseJSON.error);
          }
        });
      }
    }
  };

  return _actions;
});


/* -------------------------------------------------------------------------- */
/* Copyright 2002-2017, OpenNebula Project, OpenNebula Systems                */
/*                                                                            */
/* Licensed under the Apache License, Version 2.0 (the "License"); you may    */
/* not use this file except in compliance with the License. You may obtain    */
/* a copy of the License at                                                   */
/*                                                                            */
/* http://www.apache.org/licenses/LICENSE-2.0                                 */
/*                                                                            */
/* Unless required by applicable law or agreed to in writing, software        */
/* distributed under the License is distributed on an "AS IS" BASIS,          */
/* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.   */
/* See the License for the specific language governing permissions and        */
/* limitations under the License.                                             */
/* -------------------------------------------------------------------------- */

define('addons/tabs/payments-tab/buttons',['require','utils/locale'],function(require) {
    var Locale = require('utils/locale');

    var Buttons = {
      "Payments.refresh" : {
        type: "action",
        layout: "refresh",
        alwaysActive: true
      },
      "Payments.create_dialog" : {
        type: "create_dialog",
        layout: "create",
        alwaysActive: true
      },
      "Payments.delete" : {
        type: "confirm",
        text: Locale.tr("Delete"),
        layout: "del"
        //alwaysActive: true
      }
    };

    return Buttons;
  })
;

/* START_TEMPLATE */
define('hbs!addons/tabs/payments-tab/datatable/search',['hbs','hbs/handlebars','templates/helpers/tr'], function( hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, functionType="function";
  return "<div class=\"row\">\n  <div class=\"small-12 columns\">\n    <label>\n      "
    + escapeExpression(((helpers.tr || (depth0 && depth0.tr) || helperMissing).call(depth0, "Type", {"name":"tr","hash":{},"data":data})))
    + "\n      <input search-field=\"TYPE\" type=\"text\" list=\""
    + escapeExpression(((helper = (helper = helpers.tableId || (depth0 != null ? depth0.tableId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"tableId","hash":{},"data":data}) : helper)))
    + "-searchListTYPE\"/>\n      <datalist search-datalist=\"TYPE\" id=\""
    + escapeExpression(((helper = (helper = helpers.tableId || (depth0 != null ? depth0.tableId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"tableId","hash":{},"data":data}) : helper)))
    + "-searchListTYPE\">\n      </datalist>\n    </label>\n    <label>\n      "
    + escapeExpression(((helpers.tr || (depth0 && depth0.tr) || helperMissing).call(depth0, "Owner", {"name":"tr","hash":{},"data":data})))
    + "\n      <input search-field=\"OWNER\" type=\"text\" list=\""
    + escapeExpression(((helper = (helper = helpers.tableId || (depth0 != null ? depth0.tableId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"tableId","hash":{},"data":data}) : helper)))
    + "-searchListLABEL\"/>\n      <datalist search-datalist=\"OWNER\" id=\""
    + escapeExpression(((helper = (helper = helpers.tableId || (depth0 != null ? depth0.tableId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"tableId","hash":{},"data":data}) : helper)))
    + "-searchListLABEL\">\n      </datalist>\n    </label>\n  </div>\n</div>";
},"useData":true});
Handlebars.registerPartial('addons/tabs/payments-tab/datatable/search', t);
return t;
});
/* END_TEMPLATE */
;
/* -------------------------------------------------------------------------- */
/* Copyright 2002-2017, OpenNebula Project, OpenNebula Systems                */
/*                                                                            */
/* Licensed under the Apache License, Version 2.0 (the "License"); you may    */
/* not use this file except in compliance with the License. You may obtain    */
/* a copy of the License at                                                   */
/*                                                                            */
/* http://www.apache.org/licenses/LICENSE-2.0                                 */
/*                                                                            */
/* Unless required by applicable law or agreed to in writing, software        */
/* distributed under the License is distributed on an "AS IS" BASIS,          */
/* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.   */
/* See the License for the specific language governing permissions and        */
/* limitations under the License.                                             */
/* -------------------------------------------------------------------------- */

define('addons/tabs/payments-tab/datatable',['require','utils/tab-datatable','sunstone-config','utils/locale','hbs!./datatable/search','utils/status','./tabId'],function (require) {
  /*
    DEPENDENCIES
   */

  var TabDataTable = require('utils/tab-datatable');
  var SunstoneConfig = require('sunstone-config');
  var Locale = require('utils/locale');
  var SearchDropdown = require('hbs!./datatable/search');
  var Status = require('utils/status');

  /*
    CONSTANTS
   */

  var RESOURCE = "Payments";
  var TAB_NAME = require('./tabId');
  var LABELS_COLUMN = 3;

  /*
    CONSTRUCTOR
   */

  function Table(dataTableId, conf) {
    this.conf = conf || {};
    this.tabId = TAB_NAME;
    this.dataTableId = dataTableId;
    this.resource = RESOURCE;
    this.labelsColumn = LABELS_COLUMN;

    this.dataTableOptions = {
      "bAutoWidth": false,
      "bSortClasses": false,
      "bDeferRender": true,
      "aoColumnDefs": [
        { "bSortable": false, "aTargets": ["check"] },
        { "sWidth": "25px", "aTargets": [0]},
        { "sWidth": "30%", "aTargets": [1,2,3]},
        { "bVisible": true, "aTargets": SunstoneConfig.tabTableColumns(TAB_NAME) },
        { "sType": "text", "aTargets": [1,2,3]}
      ]
    };

    this.columns = [
      Locale.tr("Card Number"),
      Locale.tr("Owner"),
      Locale.tr("Type")
    ];

    this.selectOptions = {
      "id_index": 1,
      "name_index": 1,
      "select_resource": Locale.tr("Please select a Card from the list"),
      "you_selected": Locale.tr("You selected the following Card:"),
      "select_resource_multiple": Locale.tr("Please select one or more Cards from the list"),
      "you_selected_multiple": Locale.tr("You selected the following Cards:")
    };

    this.totalCards = 0;

    this.conf.searchDropdownHTML = SearchDropdown({ tableId: this.dataTableId });

    TabDataTable.call(this);
  }

  Table.prototype = Object.create(TabDataTable.prototype);
  Table.prototype.constructor = Table;
  Table.prototype.elementArray = _elementArray;
  Table.prototype.preUpdateView = _preUpdateView;
  Table.prototype.postUpdateView = _postUpdateView;

  return Table;

  /*
    FUNCTION DEFINITIONS
   */

  function _elementArray(element) {
    this.totalCards++;

    var search = {
      TYPE: element.brand,
      OWNER: element.name
    }

    var color_html = Status.state_lock_to_color(RESOURCE, false, undefined);

    if (element.metadata.default){
      var color_html = '<span style="float:left; margin-right: 3px; width: 5px; height: 20px; background: #4DBBD3;"></span>'
    }
    return [
      '<input class="check_item" type="checkbox" style="vertical-align: inherit; id="' + RESOURCE.toLowerCase() + '_' +
      element.id + '" name="selected_items" ' +
      'value="' + element.id + '"/>' + color_html,
      "****" + element.last4,
      element.name,
      element.brand,
      btoa(unescape(encodeURIComponent(JSON.stringify(search))))
    ];
  }

  function _preUpdateView() {
    this.totalCards = 0;
  }

  function _postUpdateView() {
    $(".total_cards").text(this.totalCards);
  }
});
define('addons/tabs/utils/countryCode',[],function () {
    return {
        "Afghanistan": "AF",
        "Åland Islands": "AX",
        "Albania": "AL",
        "Algeria": "DZ",
        "American Samoa": "AS",
        "AndorrA": "AD",
        "Angola": "AO",
        "Anguilla": "AI",
        "Antarctica": "AQ",
        "Antigua and Barbuda": "AG",
        "Argentina": "AR",
        "Armenia": "AM",
        "Aruba": "AW",
        "Australia": "AU",
        "Austria": "AT",
        "Azerbaijan": "AZ",
        "Bahamas": "BS",
        "Bahrain": "BH",
        "Bangladesh": "BD",
        "Barbados": "BB",
        "Belarus": "BY",
        "Belgium": "BE",
        "Belize": "BZ",
        "Benin": "BJ",
        "Bermuda": "BM",
        "Bhutan": "BT",
        "Bolivia": "BO",
        "Bosnia and Herzegovina": "BA",
        "Botswana": "BW",
        "Bouvet Island": "BV",
        "Brazil": "BR",
        "British Indian Ocean Territory": "IO",
        "Brunei Darussalam": "BN",
        "Bulgaria": "BG",
        "Burkina Faso": "BF",
        "Burundi": "BI",
        "Cambodia": "KH",
        "Cameroon": "CM",
        "Canada": "CA",
        "Cape Verde": "CV",
        "Cayman Islands": "KY",
        "Central African Republic": "CF",
        "Chad": "TD",
        "Chile": "CL",
        "China": "CN",
        "Christmas Island": "CX",
        "Cocos (Keeling) Islands": "CC",
        "Colombia": "CO",
        "Comoros": "KM",
        "Congo": "CG",
        "Congo, The Democratic Republic of the": "CD",
        "Cook Islands": "CK",
        "Costa Rica": "CR",
        "Cote D\"Ivoire": "CI",
        "Croatia": "HR",
        "Cuba": "CU",
        "Cyprus": "CY",
        "Czech Republic": "CZ",
        "Denmark": "DK",
        "Djibouti": "DJ",
        "Dominica": "DM",
        "Dominican Republic": "DO",
        "Ecuador": "EC",
        "Egypt": "EG",
        "El Salvador": "SV",
        "Equatorial Guinea": "GQ",
        "Eritrea": "ER",
        "Estonia": "EE",
        "Ethiopia": "ET",
        "Falkland Islands (Malvinas)": "FK",
        "Faroe Islands": "FO",
        "Fiji": "FJ",
        "Finland": "FI",
        "France": "FR",
        "French Guiana": "GF",
        "French Polynesia": "PF",
        "French Southern Territories": "TF",
        "Gabon": "GA",
        "Gambia": "GM",
        "Georgia": "GE",
        "Germany": "DE",
        "Ghana": "GH",
        "Gibraltar": "GI",
        "Greece": "GR",
        "Greenland": "GL",
        "Grenada": "GD",
        "Guadeloupe": "GP",
        "Guam": "GU",
        "Guatemala": "GT",
        "Guernsey": "GG",
        "Guinea": "GN",
        "Guinea-Bissau": "GW",
        "Guyana": "GY",
        "Haiti": "HT",
        "Heard Island and Mcdonald Islands": "HM",
        "Holy See (Vatican City State)": "VA",
        "Honduras": "HN",
        "Hong Kong": "HK",
        "Hungary": "HU",
        "Iceland": "IS",
        "India": "IN",
        "Indonesia": "ID",
        "Iran, Islamic Republic Of": "IR",
        "Iraq": "IQ",
        "Ireland": "IE",
        "Isle of Man": "IM",
        "Israel": "IL",
        "Italy": "IT",
        "Jamaica": "JM",
        "Japan": "JP",
        "Jersey": "JE",
        "Jordan": "JO",
        "Kazakhstan": "KZ",
        "Kenya": "KE",
        "Kiribati": "KI",
        "Korea, Democratic People\"S Republic of": "KP",
        "Korea, Republic of": "KR",
        "Kuwait": "KW",
        "Kyrgyzstan": "KG",
        "Lao People\"S Democratic Republic": "LA",
        "Latvia": "LV",
        "Lebanon": "LB",
        "Lesotho": "LS",
        "Liberia": "LR",
        "Libyan Arab Jamahiriya": "LY",
        "Liechtenstein": "LI",
        "Lithuania": "LT",
        "Luxembourg": "LU",
        "Macao": "MO",
        "Macedonia, The Former Yugoslav Republic of": "MK",
        "Madagascar": "MG",
        "Malawi": "MW",
        "Malaysia": "MY",
        "Maldives": "MV",
        "Mali": "ML",
        "Malta": "MT",
        "Marshall Islands": "MH",
        "Martinique": "MQ",
        "Mauritania": "MR",
        "Mauritius": "MU",
        "Mayotte": "YT",
        "Mexico": "MX",
        "Micronesia, Federated States of": "FM",
        "Moldova, Republic of": "MD",
        "Monaco": "MC",
        "Mongolia": "MN",
        "Montserrat": "MS",
        "Morocco": "MA",
        "Mozambique": "MZ",
        "Myanmar": "MM",
        "Namibia": "NA",
        "Nauru": "NR",
        "Nepal": "NP",
        "Netherlands": "NL",
        "Netherlands Antilles": "AN",
        "New Caledonia": "NC",
        "New Zealand": "NZ",
        "Nicaragua": "NI",
        "Niger": "NE",
        "Nigeria": "NG",
        "Niue": "NU",
        "Norfolk Island": "NF",
        "Northern Mariana Islands": "MP",
        "Norway": "NO",
        "Oman": "OM",
        "Pakistan": "PK",
        "Palau": "PW",
        "Palestinian Territory, Occupied": "PS",
        "Panama": "PA",
        "Papua New Guinea": "PG",
        "Paraguay": "PY",
        "Peru": "PE",
        "Philippines": "PH",
        "Pitcairn": "PN",
        "Poland": "PL",
        "Portugal": "PT",
        "Puerto Rico": "PR",
        "Qatar": "QA",
        "Reunion": "RE",
        "Romania": "RO",
        "Russian Federation": "RU",
        "RWANDA": "RW",
        "Saint Helena": "SH",
        "Saint Kitts and Nevis": "KN",
        "Saint Lucia": "LC",
        "Saint Pierre and Miquelon": "PM",
        "Saint Vincent and the Grenadines": "VC",
        "Samoa": "WS",
        "San Marino": "SM",
        "Sao Tome and Principe": "ST",
        "Saudi Arabia": "SA",
        "Senegal": "SN",
        "Serbia and Montenegro": "CS",
        "Seychelles": "SC",
        "Sierra Leone": "SL",
        "Singapore": "SG",
        "Slovakia": "SK",
        "Slovenia": "SI",
        "Solomon Islands": "SB",
        "Somalia": "SO",
        "South Africa": "ZA",
        "South Georgia and the South Sandwich Islands": "GS",
        "Spain": "ES",
        "Sri Lanka": "LK",
        "Sudan": "SD",
        "Suri": "SR",
        "Svalbard and Jan Mayen": "SJ",
        "Swaziland": "SZ",
        "Sweden": "SE",
        "Switzerland": "CH",
        "Syrian Arab Republic": "SY",
        "Taiwan, Province of China": "TW",
        "Tajikistan": "TJ",
        "Tanzania, United Republic of": "TZ",
        "Thailand": "TH",
        "Timor-Leste": "TL",
        "Togo": "TG",
        "Tokelau": "TK",
        "Tonga": "TO",
        "Trinidad and Tobago": "TT",
        "Tunisia": "TN",
        "Turkey": "TR",
        "Turkmenistan": "TM",
        "Turks and Caicos Islands": "TC",
        "Tuvalu": "TV",
        "Uganda": "UG",
        "Ukraine": "UA",
        "United Arab Emirates": "AE",
        "United Kingdom": "GB",
        "United States": "US",
        "United States Minor Outlying Islands": "UM",
        "Uruguay": "UY",
        "Uzbekistan": "UZ",
        "Vanuatu": "VU",
        "Venezuela": "VE",
        "Viet Nam": "VN",
        "Virgin Islands, British": "VG",
        "Virgin Islands, U.S.": "VI",
        "Wallis and Futuna": "WF",
        "Western Sahara": "EH",
        "Yemen": "YE",
        "Zambia": "ZM",
        "Zimbabwe": "ZW"
    }

});

/* START_TEMPLATE */
define('hbs!addons/tabs/payments-tab/form-panels/create/wizard',['hbs','hbs/handlebars','templates/helpers/tr'], function( hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "              \n<style>\n  .inputCard {\n    display: block;\n    height: 2.4230769231rem;\n    padding: .5rem;\n    border: 1px solid #e6e6e6;\n    margin: 0 0 1rem;\n    font-family: inherit;\n    font-size: 1rem;\n    color: #0a0a0a;\n    background-color: #fefefe;\n    box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.1);\n    border-radius: .2rem;\n    transition: box-shadow 0.5s, border-color 0.25s ease-in-out;\n    -webkit-appearance: none;\n  }\n\n\n  .focused {\n    border: 1px solid #8a8a8a;\n    background-color: #fefefe;\n    outline: none;\n    box-shadow: 0 0 5px #cacaca;\n    transition: box-shadow 0.5s, border-color 0.25s ease-in-out;\n  }\n\n  .invalid {\n    background-color: rgba(236, 88, 64, 0.1);\n    border-color: #ec5840;\n  }\n</style>\n\n<form data-abide novalidate id=\""
    + escapeExpression(((helper = (helper = helpers.formPanelId || (depth0 != null ? depth0.formPanelId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"formPanelId","hash":{},"data":data}) : helper)))
    + "Wizard\">\n  <fieldset>\n    <div class=\"row\">\n      <div class=\"large-6\">\n        <div class=\"large-12 columns\">\n          <label for=\"ownerName\">"
    + escapeExpression(((helpers.tr || (depth0 && depth0.tr) || helperMissing).call(depth0, "Cardholder name *", {"name":"tr","hash":{},"data":data})))
    + "</label>\n          <input required type=\"text\" name=\"ownerName\" id=\"ownerName\" />\n        </div>\n      </div>\n      <div class=\"large-6\">\n        <div class=\"large-8 columns\">\n          <label for=\"cardNumber\">"
    + escapeExpression(((helpers.tr || (depth0 && depth0.tr) || helperMissing).call(depth0, "Card Number *", {"name":"tr","hash":{},"data":data})))
    + "</label>\n          <div id=\"cardNumber\" class=\"inputCard\"></div>\n        </div>\n        <div class=\"large-4 columns\">\n          <label>"
    + escapeExpression(((helpers.tr || (depth0 && depth0.tr) || helperMissing).call(depth0, "Exp. Date *", {"name":"tr","hash":{},"data":data})))
    + "</label>\n          <div id=\"cardDate\" class=\"inputCard\"></div>\n        </div>\n      </div>\n    </div>\n    <div class=\"row\">\n      <div class=\"large-6\">\n        <div class=\"large-3 columns\">\n          <label>"
    + escapeExpression(((helpers.tr || (depth0 && depth0.tr) || helperMissing).call(depth0, "CVC *", {"name":"tr","hash":{},"data":data})))
    + "</label>\n          <div id=\"cardCVC\" class=\"inputCard\"></div>\n        </div>\n        <div class=\"large-3 columns\"></div>\n        <div class=\"large-2 columns\"></div>\n        <div class=\"large-4 columns\">\n          <label>"
    + escapeExpression(((helpers.tr || (depth0 && depth0.tr) || helperMissing).call(depth0, "Default", {"name":"tr","hash":{},"data":data})))
    + "</label>\n          <input type=\"checkbox\" style=\"vertical-align: center;\" id=\"default_card\" name=\"default_card\">\n        </div>\n      </div>\n    </div>\n    <div class=\"row\">\n      <div class=\"large-6\">\n        <div class=\"large-8 columns\">\n          <label> "
    + escapeExpression(((helpers.tr || (depth0 && depth0.tr) || helperMissing).call(depth0, "Country", {"name":"tr","hash":{},"data":data})))
    + "</label>\n          <select name=\"country_list\" value=\"Spain\" id=\"country_list\" /></select>\n        </div>\n        <div class=\"large-4 columns\">\n          <label for=\"postalCode\">"
    + escapeExpression(((helpers.tr || (depth0 && depth0.tr) || helperMissing).call(depth0, "Postal Code *", {"name":"tr","hash":{},"data":data})))
    + "</label>\n          <input required type=\"text\" name=\"postalCode\" id=\"postalCode\" />\n        </div>\n      </div>\n    </div>\n    <div class=\"row\">\n      <div class=\"large-6\">\n        <div class=\"large-12 columns\">\n          <label for=\"address\">"
    + escapeExpression(((helpers.tr || (depth0 && depth0.tr) || helperMissing).call(depth0, "Address 1 *", {"name":"tr","hash":{},"data":data})))
    + "</label>\n          <input required type=\"text\" name=\"address\" id=\"address\" />\n        </div>\n      </div>\n    </div>\n  </fieldset>\n</form>\n\n\n";
},"useData":true});
Handlebars.registerPartial('addons/tabs/payments-tab/form-panels/create/wizard', t);
return t;
});
/* END_TEMPLATE */
;
/* -------------------------------------------------------------------------- */
/* Copyright 2002-2017, OpenNebula Project, OpenNebula Systems                */
/*                                                                            */
/* Licensed under the Apache License, Version 2.0 (the "License"); you may    */
/* not use this file except in compliance with the License. You may obtain    */
/* a copy of the License at                                                   */
/*                                                                            */
/* http://www.apache.org/licenses/LICENSE-2.0                                 */
/*                                                                            */
/* Unless required by applicable law or agreed to in writing, software        */
/* distributed under the License is distributed on an "AS IS" BASIS,          */
/* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.   */
/* See the License for the specific language governing permissions and        */
/* limitations under the License.                                             */
/* -------------------------------------------------------------------------- */

define('addons/tabs/payments-tab/form-panels/create',['require','utils/form-panels/form-panel','sunstone','utils/locale','sunstone','utils/notifier','../../utils/countryCode','hbs!./create/wizard','./create/formPanelId','../tabId'],function (require) {
  /*
    DEPENDENCIES
   */

  //  require('foundation.tab');
  var BaseFormPanel = require('utils/form-panels/form-panel');
  var Sunstone = require('sunstone');
  var Locale = require('utils/locale');
  var Sunstone = require('sunstone');
  var Notifier = require('utils/notifier');
  var Country_codes = require('../../utils/countryCode');

  // STRIPE


  /*
    TEMPLATES
   */

  var TemplateWizardHTML = require('hbs!./create/wizard');

  /*
    CONSTANTS
   */

  var FORM_PANEL_ID = require('./create/formPanelId');
  var TAB_ID = require('../tabId');

  /*
    CONSTRUCTOR
   */

  function FormPanel() {
    this.formPanelId = FORM_PANEL_ID;
    this.tabId = TAB_ID;
    this.actions = {
      'create': {
        'title': Locale.tr("Create Card"),
        'buttonText': Locale.tr("Create"),
        'resetButton': true
      }
    };
    BaseFormPanel.call(this);
  }

  FormPanel.FORM_PANEL_ID = FORM_PANEL_ID;
  FormPanel.prototype = Object.create(BaseFormPanel.prototype);
  FormPanel.prototype.constructor = FormPanel;
  FormPanel.prototype.htmlWizard = _htmlWizard;
  FormPanel.prototype.submitWizard = _submitWizard;
  FormPanel.prototype.onShow = _onShow;
  FormPanel.prototype.setup = _setup;

  return FormPanel;

  function _htmlWizard() {
    return TemplateWizardHTML({
      'formPanelId': this.formPanelId
    });
  }

  function initStripe() {
    var that = this;
    that.stripe = Stripe('pk_test_u1oEbbE8uyq3PhbuaNOdvTsu');
    that.elements = stripe.elements();
    var elementStyles = {
      base: {
        color: 'black',
        fontWeight: 'normal',
        fontFamily: 'Noto SansArial, sans-serif',
        fontSize: '13px',
        fontSmoothing: 'antialiased',

        '::placeholder': {
          color: '#CFD7DF',
        },
        ':-webkit-autofill': {
          color: '#e39f48',
        },
      },
      invalid: {
        color: '#E25950',

        '::placeholder': {
          color: 'rgba(236, 88, 64, 0.3)',
        },
      },
    };

    var elementClasses = {
      focus: 'focused',
      empty: 'empty',
      invalid: 'invalid',
    };

    that.cardNumber = elements.create('cardNumber', {
      style: elementStyles,
      classes: elementClasses,
    });
    cardNumber.mount('#cardNumber');

    that.cardExpiry = elements.create('cardExpiry', {
      style: elementStyles,
      classes: elementClasses,
    });
    cardExpiry.mount('#cardDate');

    that.cardCvc = elements.create('cardCvc', {
      style: elementStyles,
      classes: elementClasses,
    });
    cardCvc.mount('#cardCVC');
  }

  function _setup(context) {
    $.getScript('https://js.stripe.com/v3/')
      .done(function (script, textStatus) {
        country_datalist_fill();
        initStripe();
      })
      .fail(function (jqxhr, settings, exception) {
      });
  }

  function _submitWizard(context) {

    //card specific information
    var ownerName = $('#ownerName', context).val();
    var address = $('#address', context).val();
    var postalCode = $('#postalCode', context).val();
    var country_name=$('#country_list', context).val();
    // var countryISO = Country_codes[country_name];
    that.defaultCard = $('#default_card').is(":checked") ? true : false;

    that.cardData = {
      'name': ownerName,
      'address_line1': address,
      'address_zip': postalCode,
      'address_country': country_name,
      //'country': countryISO
    }

    that.stripe.createToken(cardNumber, that.cardData).then(function (result) {
      if (result.error) {
        Sunstone.hideFormPanelLoading(this.tabId);
        Notifier.notifyError(Locale.tr(result.error.message));
        return false;
      } else {
        result.token.default = that.defaultCard;
        Sunstone.runAction("Payments.create", result.token);
        return false;
      }
    });
    return false;
  }

  function _onShow(context) {
  }

  function country_datalist_fill(context) {
    var country = '';
    jQuery.each(Country_codes, function(i, val){
      if(i == "Spain") {
        country += '<option selected value="' + i + '">'+ i +'</option>';
      }
      country += '<option value="' + i + '">'+ i +'</option>';
    })

    $("#country_list").html(country);
  }
});


/* START_TEMPLATE */
define('hbs!addons/tabs/payments-tab/panels/info/html',['hbs','hbs/handlebars','templates/helpers/tr'], function( hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  return "					<td class=\"value_td\" colspan=\"2\">YES</td>\n					";
  },"3":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, buffer = " ";
  stack1 = ((helper = (helper = helpers.renameTrDefault || (depth0 != null ? depth0.renameTrDefault : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"renameTrDefault","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " ";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, functionType="function", lambda=this.lambda, buffer = "              \n\n<style>\n	.focused {\n		border: 1px solid #8a8a8a;\n		background-color: #fefefe;\n		outline: none;\n		box-shadow: 0 0 5px #cacaca;\n		transition: box-shadow 0.5s, border-color 0.25s ease-in-out;\n	}\n\n	.invalid {\n		background-color: rgba(236, 88, 64, 0.1);\n		border-color: #ec5840;\n	}\n</style>\n\n\n<div class=\"row\">\n	<div class=\"large-6 columns\">\n		<table id=\"info_zone_table\" class=\"dataTable\">\n			<thead>\n				<tr>\n					<th colspan=\"3\">"
    + escapeExpression(((helpers.tr || (depth0 && depth0.tr) || helperMissing).call(depth0, "Payment method details", {"name":"tr","hash":{},"data":data})))
    + "</th>\n				</tr>\n			</thead>\n			<tbody>\n				<tr>\n					";
  stack1 = ((helper = (helper = helpers.renameTrName || (depth0 != null ? depth0.renameTrName : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"renameTrName","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\n				</tr>\n				<tr>\n					<td class=\"key_td\">"
    + escapeExpression(((helpers.tr || (depth0 && depth0.tr) || helperMissing).call(depth0, "Card number", {"name":"tr","hash":{},"data":data})))
    + "</td>\n					<td class=\"value_td\" colspan=\"2\">****"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.element : depth0)) != null ? stack1.last4 : stack1), depth0))
    + "</td>\n				</tr>\n				<tr>\n					";
  stack1 = ((helper = (helper = helpers.renameTrExpMonth || (depth0 != null ? depth0.renameTrExpMonth : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"renameTrExpMonth","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  buffer += " ";
  stack1 = ((helper = (helper = helpers.renameTrExpYear || (depth0 != null ? depth0.renameTrExpYear : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"renameTrExpYear","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\n				</tr>\n				<tr>\n					<td class=\"key_td\">"
    + escapeExpression(((helpers.tr || (depth0 && depth0.tr) || helperMissing).call(depth0, "Brand", {"name":"tr","hash":{},"data":data})))
    + "</td>\n					<td class=\"value_td\" colspan=\"2\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.element : depth0)) != null ? stack1.brand : stack1), depth0))
    + "</td>\n				</tr>\n				<tr>\n					<td class=\"key_td\">"
    + escapeExpression(((helpers.tr || (depth0 && depth0.tr) || helperMissing).call(depth0, "Default", {"name":"tr","hash":{},"data":data})))
    + "</td>\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.isDefault : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.program(3, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\n				</tr>\n			</tbody>\n		</table>\n	</div>\n	<div class=\"large-6 columns\">\n		<table id=\"info_zone_table\" class=\"dataTable\">\n			<thead>\n				<tr>\n					<th colspan=\"3\">"
    + escapeExpression(((helpers.tr || (depth0 && depth0.tr) || helperMissing).call(depth0, "Billing address", {"name":"tr","hash":{},"data":data})))
    + "</th>\n				</tr>\n			</thead>\n			<tbody>\n				";
  stack1 = ((helper = (helper = helpers.renameTrAddress || (depth0 != null ? depth0.renameTrAddress : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"renameTrAddress","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  buffer += " ";
  stack1 = ((helper = (helper = helpers.renameTrCountry || (depth0 != null ? depth0.renameTrCountry : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"renameTrCountry","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  buffer += " ";
  stack1 = ((helper = (helper = helpers.renameTrPostalCode || (depth0 != null ? depth0.renameTrPostalCode : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"renameTrPostalCode","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n			</tbody>\n		</table>\n	</div>\n</div>";
},"useData":true});
Handlebars.registerPartial('addons/tabs/payments-tab/panels/info/html', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
define('hbs!addons/tabs/utils/fields-tr/html',['hbs','hbs/handlebars','templates/helpers/isTabActionEnabled'], function( hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "    <div id=\"div_edit_rename\">\n      <button id=\"div_edit_"
    + escapeExpression(((helper = (helper = helpers.trIdTitle || (depth0 != null ? depth0.trIdTitle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"trIdTitle","hash":{},"data":data}) : helper)))
    + "\" style=\"color: #2E9CB9; border: none; outline:none\" class=\"edit_e\" href=\"#\"> <i class=\"fas fa-edit right\"/></button>\n    </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\n\n<tr class=\""
    + escapeExpression(((helper = (helper = helpers.resourceType || (depth0 != null ? depth0.resourceType : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"resourceType","hash":{},"data":data}) : helper)))
    + "_rename\">\n  <td class=\"key_td\">"
    + escapeExpression(((helper = (helper = helpers.trTitle || (depth0 != null ? depth0.trTitle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"trTitle","hash":{},"data":data}) : helper)))
    + "</td>\n  <td id=\"value_td_"
    + escapeExpression(((helper = (helper = helpers.trIdTitle || (depth0 != null ? depth0.trIdTitle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"trIdTitle","hash":{},"data":data}) : helper)))
    + "\" class=\"value_td_rename\">"
    + escapeExpression(((helper = (helper = helpers.resourceName || (depth0 != null ? depth0.resourceName : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"resourceName","hash":{},"data":data}) : helper)))
    + "</td>\n  <td>\n";
  stack1 = ((helpers.isTabActionEnabled || (depth0 && depth0.isTabActionEnabled) || helperMissing).call(depth0, (depth0 != null ? depth0.tabName : depth0), (depth0 != null ? depth0.action : depth0), {"name":"isTabActionEnabled","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "  </td>\n</tr>\n";
},"useData":true});
Handlebars.registerPartial('addons/tabs/utils/fields-tr/html', t);
return t;
});
/* END_TEMPLATE */
;
/* -------------------------------------------------------------------------- */
/* Copyright 2002-2018, OpenNebula Project, OpenNebula Systems                */
/*                                                                            */
/* Licensed under the Apache License, Version 2.0 (the "License"); you may    */
/* not use this file except in compliance with the License. You may obtain    */
/* a copy of the License at                                                   */
/*                                                                            */
/* http://www.apache.org/licenses/LICENSE-2.0                                 */
/*                                                                            */
/* Unless required by applicable law or agreed to in writing, software        */
/* distributed under the License is distributed on an "AS IS" BASIS,          */
/* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.   */
/* See the License for the specific language governing permissions and        */
/* limitations under the License.                                             */
/* -------------------------------------------------------------------------- */

define('addons/tabs/utils/fields-tr',['require','hbs!./fields-tr/html','sunstone','sunstone-config','utils/notifier','./countryCode'],function (require) {
  /*
    This module insert a row with the name of the resource.
    The row can be edited and a rename action will be sent
   */

  var TemplateRenameTr = require('hbs!./fields-tr/html');

  var Sunstone = require('sunstone');
  var Config = require('sunstone-config');
  var Notifier = require('utils/notifier');
  var Country_codes = require('./countryCode');
  /*
    Generate the tr HTML with the name of the resource and an edit icon
    @param {String} tabName
    @param {String} resourceType Resource type (i.e: Zone, Host, Image...)
    @param {String} resourceName Name of the resource
    @returns {String} HTML row
   */
  var _html = function (tabName, resourceType, resourceName, trTitle) {
    var trIdTitle = trTitle.split(' ').join('_').toUpperCase();
    if (trIdTitle == "DEFAULT") {
      var renameTrHTML = '<td class="value_td" colspan="2"><input class="input_edit_value_rename" id="input_edit_DEFAULT" type="checkbox"/></td>';
    } else {

      var renameTrHTML = TemplateRenameTr({
        'trTitle': trTitle,
        'trIdTitle': trIdTitle,
        'resourceType': resourceType.toLowerCase(),
        'resourceName': resourceName,
        'tabName': tabName,
        'action': resourceType + '.rename',
      });
    }
    return renameTrHTML;
  };

  /*
    Initialize the row, clicking the edit icon will add an input to edit the name
    @param {String} tabName
    @param {String} resourceType Resource type (i.e: Zone, Host, Image...)
    @param {String} resourceId ID of the resource
    @param {jQuery Object} context Selector including the tr
   */
  var _setup = function (tabName, resourceType, resourceId, context) {

    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1;
    var year = dateObj.getUTCFullYear();


    if (Config.isTabActionEnabled(tabName, resourceType + '.rename')) {
      //name
      context.off("click", "#div_edit_CARDHOLDER_NAME");
      context.on("click", "#div_edit_CARDHOLDER_NAME", function () {
        var valueStr = $("#value_td_CARDHOLDER_NAME", context).text();
        $("#value_td_CARDHOLDER_NAME", context).html('<input class="input_edit_value_rename" id="input_edit_CARDHOLDER_NAME" type="text" value="' + valueStr + '"/>');
      });
      context.off("change", "#input_edit_CARDHOLDER_NAME");
      context.on("change", "#input_edit_CARDHOLDER_NAME", function () {
        var valueStr = $("#input_edit_CARDHOLDER_NAME", context).val();
        if (valueStr != "") {
          var nameTemplate = { "name": valueStr };
          $(".edit_e", context).prop('disabled', true);
          $(".input_edit_value_rename", context).prop("disabled", true);
          $("#input_edit_CARDHOLDER_NAME", context).prop("disabled", true);
          $("#input_edit_CARDHOLDER_NAME", context).removeClass("invalid");
          Sunstone.runAction(resourceType + ".rename", resourceId, nameTemplate);
        } else {
          $("#input_edit_CARDHOLDER_NAME", context).addClass("invalid");
          Notifier.notifyError("Name field is empty");
        }
      });

      //address_line1
      context.off("click", "#div_edit_ADDRESS_1");
      context.on("click", "#div_edit_ADDRESS_1", function () {
        var valueStr = $("#value_td_ADDRESS_1", context).text();
        $("#value_td_ADDRESS_1", context).html('<input class="input_edit_value_rename" id="input_edit_ADDRESS_1" type="text" value="' + valueStr + '"/>');
      });

      context.off("change", "#input_edit_ADDRESS_1");
      context.on("change", "#input_edit_ADDRESS_1", function () {
        var valueStr = $("#input_edit_ADDRESS_1", context).val();
        if (valueStr != "") {
          var nameTemplate = { "address_line1": valueStr };
          $(".edit_e", context).prop('disabled', true);
          $(".input_edit_value_rename", context).prop("disabled", true);
          $("#input_edit_ADDRESS_1", context).prop("disabled", true); name
          $("#input_edit_ADDRESS_1", context).removeClass("invalid");
          Sunstone.runAction(resourceType + ".rename", resourceId, nameTemplate);
        } else {
          Notifier.notifyError("Address field is empty");
          $("#input_edit_ADDRESS_1", context).addClass("invalid");
        }
      });

      //EXPIRATION_YEAR
      context.off("click", "#div_edit_EXPIRATION_YEAR");
      context.on("click", "#div_edit_EXPIRATION_YEAR", function () {
        var valueStr = $("#value_td_EXPIRATION_YEAR", context).text();
        $("#value_td_EXPIRATION_YEAR", context).html('<input class="input_edit_value_rename" id="input_edit_EXPIRATION_YEAR" type="text" onkeypress="return (event.charCode >= 48 && event.charCode <= 57) || event.charCode == 13 " maxlength="4" value="' + valueStr + '"/>');
      });

      context.off("change", "#input_edit_EXPIRATION_YEAR");
      context.on("change", "#input_edit_EXPIRATION_YEAR", function () {
        var valueStr = $("#input_edit_EXPIRATION_YEAR", context).val();
        var valueInt = parseInt(valueStr);
        if (valueStr != "" && (valueInt >= year && valueInt < (year + 51))) {
          var nameTemplate = { "exp_year": valueStr };
          $(".edit_e", context).prop('disabled', true);
          $(".input_edit_value_rename", context).prop("disabled", true);
          $("#input_edit_EXPIRATION_YEAR", context).prop("disabled", true);
          $("#input_edit_EXPIRATION_YEAR", context).removeClass("invalid");
          Sunstone.runAction(resourceType + ".rename", resourceId, nameTemplate);
        } else {
          $("#input_edit_EXPIRATION_YEAR", context).addClass("invalid");
          Notifier.notifyError("Expiration year is not valid");
        }
      });

      //exp_month
      context.off("click", "#div_edit_EXPIRATION_MONTH");
      context.on("click", "#div_edit_EXPIRATION_MONTH", function () {
        var valueStr = $("#value_td_EXPIRATION_MONTH", context).text();
        $("#value_td_EXPIRATION_MONTH", context).html('<input class="input_edit_value_rename" id="input_edit_EXPIRATION_MONTH" type="text" onkeypress="return (event.charCode >= 48 && event.charCode <= 57) || event.charCode == 13" maxlength="2" value="' + valueStr + '"/>');
      });

      context.off("change", "#input_edit_EXPIRATION_MONTH");
      context.on("change", "#input_edit_EXPIRATION_MONTH", function () {
        var valueStr = $("#input_edit_EXPIRATION_MONTH", context).val();
        var valueInt = parseInt(valueStr);
        if (valueStr != "" && (valueInt < 13 && valueInt > 0)) {
          var nameTemplate = { "exp_month": valueStr };
          $(".edit_e", context).prop('disabled', true);
          $(".input_edit_value_rename", context).prop("disabled", true);
          $("#input_edit_EXPIRATION_MONTH", context).prop("disabled", true);
          $("#input_edit_EXPIRATION_MONTH", context).removeClass("invalid");
          Sunstone.runAction(resourceType + ".rename", resourceId, nameTemplate);
        } else {
          $("#input_edit_EXPIRATION_MONTH", context).addClass("invalid");
          Notifier.notifyError("Expiration month field is invalid");
        }
      });

      //address_line2
      context.off("click", "#div_edit_ADDRESS_2");
      context.on("click", "#div_edit_ADDRESS_2", function () {
        var valueStr = $("#value_td_ADDRESS_2", context).text();
        $("#value_td_ADDRESS_2", context).html('<input class="input_edit_value_rename" id="input_edit_ADDRESS_2" type="text" value="' + valueStr + '"/>');
      });

      context.off("change", "#input_edit_ADDRESS_2");
      context.on("change", "#input_edit_ADDRESS_2", function () {
        var valueStr = $("#input_edit_ADDRESS_2", context).val();
        if (valueStr == "") {
          valueStr = " ";
        }
        var nameTemplate = { "address_line2": valueStr };
        $(".edit_e", context).prop('disabled', true);
        $(".input_edit_value_rename", context).prop("disabled", true);
        $("#input_edit_ADDRESS_2", context).prop("disabled", true);
        $("#input_edit_ADDRESS_2", context).removeClass("invalid");
        Sunstone.runAction(resourceType + ".rename", resourceId, nameTemplate);
      });

      //DEFAULT
      context.off("click", "#div_edit_DEFAULT");
      context.on("click", "#div_edit_DEFAULT", function () {
        var valueStr = $("#value_td_DEFAULT", context).text();
        $("#value_td_DEFAULT", context).html('<input class="input_edit_value_rename" id="input_edit_DEFAULT" type="checkbox" value="' + valueStr + '"/>');
      });
      context.off("change", "#input_edit_DEFAULT");
      context.on("change", "#input_edit_DEFAULT", function () {
        var valueStr = $("#input_edit_DEFAULT", context).val();
        var nameTemplate = { "default": true };
        $(".edit_e", context).prop('disabled', true);
        $("#input_edit_DEFAULT", context).prop("disabled", true);
        $(".input_edit_value_rename", context).prop("disabled", true);
        Sunstone.runAction(resourceType + ".rename", resourceId, nameTemplate);
      });

      //Postal Code
      context.off("click", "#div_edit_POSTAL_CODE");
      context.on("click", "#div_edit_POSTAL_CODE", function () {
        var valueStr = $("#value_td_POSTAL_CODE", context).text();
        $("#value_td_POSTAL_CODE", context).html('<input class="input_edit_value_rename" id="input_edit_POSTAL_CODE" type="text" value="' + valueStr + '"/>');
      });

      context.off("change", "#input_edit_POSTAL_CODE");
      context.on("change", "#input_edit_POSTAL_CODE", function () {
        var valueStr = $("#input_edit_POSTAL_CODE", context).val();
        if (valueStr != "") {
          var nameTemplate = { "address_zip": valueStr };
          $(".edit_e", context).prop('disabled', true);
          $(".input_edit_value_rename", context).prop("disabled", true);
          $("#input_edit_POSTAL_CODE", context).prop("disabled", true);
          $("#input_edit_POSTAL_CODE", context).removeClass("invalid");
          Sunstone.runAction(resourceType + ".rename", resourceId, nameTemplate);

        } else {
          Notifier.notifyError("Postal code field is empty");
          $("#input_edit_POSTAL_CODE", context).addClass("invalid");
        }
      });

      //Country
      context.off("click", "#div_edit_COUNTRY");
      context.on("click", "#div_edit_COUNTRY", function () {
        var valueStr = $("#value_td_COUNTRY", context).text();
        $("#value_td_COUNTRY", context).html('<select name="country_list" id="input_edit_COUNTRY" value="' + valueStr + '"/> </select>');
        country_datalist_fill(valueStr);
      });

      context.off("change", "#input_edit_COUNTRY");
      context.on("change", "#input_edit_COUNTRY", function () {
        var valueStr = $("#input_edit_COUNTRY", context).val();
        if (valueStr != "") {
          var nameTemplate = { "address_country": valueStr };
          $(".edit_e", context).prop('disabled', true);
          $(".input_edit_value_rename", context).prop("disabled", true);
          $("#input_edit_COUNTRY", context).prop("disabled", true);
          $("#input_edit_COUNTRY", context).removeClass("invalid");
          Sunstone.runAction(resourceType + ".rename", resourceId, nameTemplate);

        } else {
          Notifier.notifyError("Postal code field is empty");
          $("#input_edit_COUNTRY", context).addClass("invalid");
        }
      });

    }

    return false;
  }

  function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  function country_datalist_fill(selected, context) {
    var country = '';
    jQuery.each(Country_codes, function(i, val){
      if(i == selected) {
        country += '<option selected value="' + i + '">'+ i +'</option>';
      }
      country += '<option value="' + i + '">'+ i +'</option>';
    })

    $("#input_edit_COUNTRY").html(country);
  }

  return {
    'html': _html,
    'setup': _setup
  }
});

/* -------------------------------------------------------------------------- */
/* Copyright 2002-2017, OpenNebula Project, OpenNebula Systems                */
/*                                                                            */
/* Licensed under the Apache License, Version 2.0 (the "License"); you may    */
/* not use this file except in compliance with the License. You may obtain    */
/* a copy of the License at                                                   */
/*                                                                            */
/* http://www.apache.org/licenses/LICENSE-2.0                                 */
/*                                                                            */
/* Unless required by applicable law or agreed to in writing, software        */
/* distributed under the License is distributed on an "AS IS" BASIS,          */
/* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.   */
/* See the License for the specific language governing permissions and        */
/* limitations under the License.                                             */
/* -------------------------------------------------------------------------- */

define('addons/tabs/payments-tab/panels/info/panelId',['require'],function (require) {
  return 'payment_info_tab';
});
define('addons/tabs/payments-tab/panels/info',['require','hbs!./info/html','utils/locale','../../utils/fields-tr','utils/locale','../tabId','./info/panelId'],function (require) {
	/*
		DEPENDENCIES
	 */


	var TemplateInfo = require('hbs!./info/html');
	var Locale = require('utils/locale');
	var RenameTr = require('../../utils/fields-tr');


	/*
		CONSTANTS
	 */
	var Locale = require('utils/locale');
	var TAB_ID = require('../tabId');
	var PANEL_ID = require('./info/panelId');
	var RESOURCE = "Payments"

	/*
		CONSTRUCTOR
	 */

	function Panel(info) {
		this.title = Locale.tr("Info");
		this.icon = "fa-info-circle";
		this.tabId = TAB_ID;
		this.element = info;

		return this;
	};

	Panel.PANEL_ID = PANEL_ID;
	Panel.prototype.html = _html;
	Panel.prototype.setup = _setup;

	return Panel;


	function _html() {
		var renameTrName = RenameTr.html(TAB_ID, RESOURCE, this.element.name, "Cardholder name");
		var renameTrAddress = RenameTr.html(TAB_ID, RESOURCE, this.element.address_line1, "Address 1");
		var renameTrExpYear = RenameTr.html(TAB_ID, RESOURCE, this.element.exp_year, "Expiration year");
		var renameTrExpMonth = RenameTr.html(TAB_ID, RESOURCE, this.element.exp_month, "Expiration month");
		var renameTrDefault = RenameTr.html(TAB_ID, RESOURCE, this.element.metadata.default, "Default");
		var renameTrPostalCode = RenameTr.html(TAB_ID, RESOURCE, this.element.address_zip, "Postal code");
		var renameTrCountry = RenameTr.html(TAB_ID, RESOURCE, this.element.address_country, "Country");

		var isDefault = false;
		if (this.element.metadata.default === "true") {
			isDefault = true;
		}

		return TemplateInfo({
			'element': this.element,
			'renameTrName': renameTrName,
			'renameTrAddress': renameTrAddress,
			'renameTrExpYear': renameTrExpYear,
			'renameTrExpMonth': renameTrExpMonth,
			'renameTrDefault': renameTrDefault,
			'renameTrPostalCode': renameTrPostalCode,
			'renameTrCountry': renameTrCountry,
			'isDefault': isDefault
		});
	}

	function _setup(context) {
		RenameTr.setup(TAB_ID, RESOURCE, this.element.id, context);
		return false;
	}
});

/* -------------------------------------------------------------------------- */
/* Copyright 2002-2017, OpenNebula Project, OpenNebula Systems                */
/*                                                                            */
/* Licensed under the Apache License, Version 2.0 (the "License"); you may    */
/* not use this file except in compliance with the License. You may obtain    */
/* a copy of the License at                                                   */
/*                                                                            */
/* http://www.apache.org/licenses/LICENSE-2.0                                 */
/*                                                                            */
/* Unless required by applicable law or agreed to in writing, software        */
/* distributed under the License is distributed on an "AS IS" BASIS,          */
/* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.   */
/* See the License for the specific language governing permissions and        */
/* limitations under the License.                                             */
/* -------------------------------------------------------------------------- */

define('addons/tabs/payments-tab',['require','utils/locale','./payments-tab/actions','./payments-tab/buttons','./payments-tab/tabId','./payments-tab/datatable','./payments-tab/form-panels/create','./payments-tab/panels/info'],function (require) {
  var Locale = require('utils/locale');
  var _actions = require('./payments-tab/actions');
  var _buttons = require('./payments-tab/buttons');
  var TAB_ID = require('./payments-tab/tabId');
  var Table = require('./payments-tab/datatable');

  var DATATABLE_ID = "dataTableCards";
  var _formPanels = [
    require('./payments-tab/form-panels/create')
  ];

  var _panels = [
    require('./payments-tab/panels/info'),
  ];

  var Tab = {
    tabId: TAB_ID,
    title: Locale.tr("Payments Method"),
    icon: 'fa-credit-card',
    tabClass: "subTab",
    parentTab: "billing-top-tab",
    listHeader: Locale.tr("Payment Methods"),
    infoHeader: Locale.tr("Cards"),
    subheader: '<span>\
          <span class="total_cards"/> <small>'+ Locale.tr("TOTAL") + '</small>\
        </span>',
    resource: 'Payments',
    buttons: _buttons,
    actions: _actions,
    formPanels: _formPanels,
    dataTable: new Table(DATATABLE_ID, { actions: true, info: true }),
    panels: _panels
  };

  return Tab;
});

/* -------------------------------------------------------------------------- */
/* Copyright 2002-2017, OpenNebula Project, OpenNebula Systems                */
/*                                                                            */
/* Licensed under the Apache License, Version 2.0 (the "License"); you may    */
/* not use this file except in compliance with the License. You may obtain    */
/* a copy of the License at                                                   */
/*                                                                            */
/* http://www.apache.org/licenses/LICENSE-2.0                                 */
/*                                                                            */
/* Unless required by applicable law or agreed to in writing, software        */
/* distributed under the License is distributed on an "AS IS" BASIS,          */
/* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.   */
/* See the License for the specific language governing permissions and        */
/* limitations under the License.                                             */
/* -------------------------------------------------------------------------- */

define('addons/tabs/billing-top-tab',['require','utils/locale'],function(require) {
    var Locale = require('utils/locale');
    var TAB_ID = 'billing-top-tab';

    var Tab = {
      tabId: TAB_ID,
      title: Locale.tr("Billing"),
      no_content: true
    }

    return Tab;
  });
/* -------------------------------------------------------------------------- */
/* Copyright 2002-2017, OpenNebula Project, OpenNebula Systems                */
/*                                                                            */
/* Licensed under the Apache License, Version 2.0 (the "License"); you may    */
/* not use this file except in compliance with the License. You may obtain    */
/* a copy of the License at                                                   */
/*                                                                            */
/* http://www.apache.org/licenses/LICENSE-2.0                                 */
/*                                                                            */
/* Unless required by applicable law or agreed to in writing, software        */
/* distributed under the License is distributed on an "AS IS" BASIS,          */
/* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.   */
/* See the License for the specific language governing permissions and        */
/* limitations under the License.                                             */
/* -------------------------------------------------------------------------- */

define('addons/tabs/billing-info-tab/tabId',['require'],function(require){
    return 'billing-info-tab';
  });
/* -------------------------------------------------------------------------- */
/* Copyright 2002-2017, OpenNebula Project, OpenNebula Systems                */
/*                                                                            */
/* Licensed under the Apache License, Version 2.0 (the "License"); you may    */
/* not use this file except in compliance with the License. You may obtain    */
/* a copy of the License at                                                   */
/*                                                                            */
/* http://www.apache.org/licenses/LICENSE-2.0                                 */
/*                                                                            */
/* Unless required by applicable law or agreed to in writing, software        */
/* distributed under the License is distributed on an "AS IS" BASIS,          */
/* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.   */
/* See the License for the specific language governing permissions and        */
/* limitations under the License.                                             */
/* -------------------------------------------------------------------------- */

define('addons/tabs/billing-info-tab/form-panels/create/formPanelId',['require'],function(require){
    return 'updateBillingInfoForm';
  });
  
/* -------------------------------------------------------------------------- */
/* Copyright 2002-2017, OpenNebula Project, OpenNebula Systems                */
/*                                                                            */
/* Licensed under the Apache License, Version 2.0 (the "License"); you may    */
/* not use this file except in compliance with the License. You may obtain    */
/* a copy of the License at                                                   */
/*                                                                            */
/* http://www.apache.org/licenses/LICENSE-2.0                                 */
/*                                                                            */
/* Unless required by applicable law or agreed to in writing, software        */
/* distributed under the License is distributed on an "AS IS" BASIS,          */
/* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.   */
/* See the License for the specific language governing permissions and        */
/* limitations under the License.                                             */
/* -------------------------------------------------------------------------- */



define('addons/tabs/billing-info-tab/actions',['require','utils/notifier','./tabId','./form-panels/create/formPanelId','sunstone'],function (require) {

  var Notifier = require('utils/notifier');
  var TAB_ID = require('./tabId');
  var PATH = 'billing/billing-info';
  var CREATE_DIALOG_ID = require('./form-panels/create/formPanelId');
  var Sunstone = require('sunstone');

  var _actions = {
    "Billing-info.list": {
      call: function () {
        $.ajax({
          url: PATH,
          type: "GET",
          dataType: "json",
          success: function (response, request) {
            formatHTML(response);
          },
          error: function (response) {
            console.log("refresh error");
          }
        });
      }

    },
    "Billing-info.create_dialog": {
      call: function () {
        Sunstone.showFormPanel(TAB_ID, CREATE_DIALOG_ID, "update");
      }
    },
    "Billing-info.update": {
      type: "create",
      call: function (params) {
        $.ajax({
          url: PATH,
          type: "POST",
          dataType: "json",
          data: JSON.stringify(params.data),
          contentType: "application/json; charset=utf-8",
          success: function (response, request) {
            Sunstone.resetFormPanel(TAB_ID, CREATE_DIALOG_ID);
            Sunstone.hideFormPanel(TAB_ID);
            Notifier.notifyMessage("User information updated");
          },
          error: function (response, request) {
            console.log(response, request);
          }
        });
      }
    }
  };

  return _actions;

  function formatHTML(response){
    $("#customer-id").text(response.id);
    $("#customer-name").text(response.name);
    $("#customer-company-name").text(response.companyName);
    $("#customer-address").text(response.address);
    $("#customer-VAT").text(response.VAT);
    $("#customer-email").text(response.email);

  }
});


/* -------------------------------------------------------------------------- */
/* Copyright 2002-2017, OpenNebula Project, OpenNebula Systems                */
/*                                                                            */
/* Licensed under the Apache License, Version 2.0 (the "License"); you may    */
/* not use this file except in compliance with the License. You may obtain    */
/* a copy of the License at                                                   */
/*                                                                            */
/* http://www.apache.org/licenses/LICENSE-2.0                                 */
/*                                                                            */
/* Unless required by applicable law or agreed to in writing, software        */
/* distributed under the License is distributed on an "AS IS" BASIS,          */
/* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.   */
/* See the License for the specific language governing permissions and        */
/* limitations under the License.                                             */
/* -------------------------------------------------------------------------- */

define('addons/tabs/billing-info-tab/buttons',['require','utils/locale'],function(require) {
    var Locale = require('utils/locale');

    var Buttons = {
      "Billing-info.list" : {
        type: "action",
        layout: "refresh",
        alwaysActive: true
      },
      "Billing-info.create_dialog" : {
        type: "create_dialog",
        text: Locale.tr("Update"),
        layout: "update",
        alwaysActive: true
      }
    };

    return Buttons;
  })
;

/* START_TEMPLATE */
define('hbs!addons/tabs/billing-info-tab/utils/wizard',['hbs','hbs/handlebars','templates/helpers/tr'], function( hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<fieldset>\n	<legend>"
    + escapeExpression(((helpers.tr || (depth0 && depth0.tr) || helperMissing).call(depth0, "Profile information", {"name":"tr","hash":{},"data":data})))
    + "</legend>\n	<div class=\"row\">\n	<div class=\"large-12 columns\">\n		<table id=\"info_zone_table\" class=\"dataTable\">\n			<thead>\n			</thead>\n			<tbody>\n				<tr>\n					<td class=\"key_td\">"
    + escapeExpression(((helpers.tr || (depth0 && depth0.tr) || helperMissing).call(depth0, "Customer ID", {"name":"tr","hash":{},"data":data})))
    + "</td>\n					<td class=\"value_td\" id=\"customer-id\" colspan=\"2\"></td>\n				</tr>\n				<tr>\n					<td class=\"key_td\">"
    + escapeExpression(((helpers.tr || (depth0 && depth0.tr) || helperMissing).call(depth0, "Name", {"name":"tr","hash":{},"data":data})))
    + "</td>\n					<td class=\"value_td\" id=\"customer-name\" colspan=\"2\"></td>\n				</tr>\n				<tr>\n					<td class=\"key_td\">"
    + escapeExpression(((helpers.tr || (depth0 && depth0.tr) || helperMissing).call(depth0, "Email", {"name":"tr","hash":{},"data":data})))
    + "</td>\n					<td class=\"value_td\" id=\"customer-email\" colspan=\"2\"></td>\n				</tr>\n				<tr>\n					<td class=\"key_td\">"
    + escapeExpression(((helpers.tr || (depth0 && depth0.tr) || helperMissing).call(depth0, "Company name", {"name":"tr","hash":{},"data":data})))
    + "</td>\n					<td class=\"value_td\" id=\"customer-company-name\" colspan=\"2\"></td>\n				</tr>\n				<tr>\n					<td class=\"key_td\">"
    + escapeExpression(((helpers.tr || (depth0 && depth0.tr) || helperMissing).call(depth0, "Address", {"name":"tr","hash":{},"data":data})))
    + "</td>\n					<td class=\"value_td\" id=\"customer-address\" colspan=\"2\"></td>\n				</tr>\n				<tr>\n					<td class=\"key_td\">"
    + escapeExpression(((helpers.tr || (depth0 && depth0.tr) || helperMissing).call(depth0, "VAT ID", {"name":"tr","hash":{},"data":data})))
    + "</td>\n					<td class=\"value_td\" id=\"customer-VAT\" colspan=\"2\"></td>\n				</tr>\n			</tbody>\n		</table>\n	</div>\n</div>\n</fieldset>";
},"useData":true});
Handlebars.registerPartial('addons/tabs/billing-info-tab/utils/wizard', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
define('hbs!addons/tabs/billing-info-tab/form-panels/create/wizard',['hbs','hbs/handlebars','templates/helpers/tr'], function( hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, lambda=this.lambda;
  return "<style>\n  .inputCard {\n    display: block;\n    height: 2.4230769231rem;\n    padding: .5rem;\n    border: 1px solid #e6e6e6;\n    margin: 0 0 1rem;\n    font-family: inherit;\n    font-size: 1rem;\n    color: #0a0a0a;\n    background-color: #fefefe;\n    box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.1);\n    border-radius: .2rem;\n    transition: box-shadow 0.5s, border-color 0.25s ease-in-out;\n    -webkit-appearance: none;\n  }\n\n\n  .focused {\n    border: 1px solid #8a8a8a;\n    background-color: #fefefe;\n    outline: none;\n    box-shadow: 0 0 5px #cacaca;\n    transition: box-shadow 0.5s, border-color 0.25s ease-in-out;\n  }\n\n  .invalid {\n    background-color: rgba(236, 88, 64, 0.1);\n    border-color: #ec5840;\n  }\n</style>\n\n<form data-abide novalidate id=\""
    + escapeExpression(((helper = (helper = helpers.formPanelId || (depth0 != null ? depth0.formPanelId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"formPanelId","hash":{},"data":data}) : helper)))
    + "Wizard\" class=\"custom creation\">\n  <div class=\"row\">\n    <fieldset>\n      <legend>"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.customer : depth0)) != null ? stack1.id : stack1), depth0))
    + "</legend>\n      <div></div>\n      <div class=\"medium-6\">\n        <label for=\"name\">"
    + escapeExpression(((helpers.tr || (depth0 && depth0.tr) || helperMissing).call(depth0, "Your name", {"name":"tr","hash":{},"data":data})))
    + "</label>\n        <input type=\"text\" required name=\"name\" id=\"name\" value=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.customer : depth0)) != null ? stack1.name : stack1), depth0))
    + "\" />\n      </div>\n      <div class=\"medium-6\">\n        <label for=\"companyName\">"
    + escapeExpression(((helpers.tr || (depth0 && depth0.tr) || helperMissing).call(depth0, "Company name", {"name":"tr","hash":{},"data":data})))
    + "</label>\n        <input type=\"text\" required name=\"companyName\" id=\"companyName\" value=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.customer : depth0)) != null ? stack1.companyName : stack1), depth0))
    + "\" />\n      </div>\n      <div class=\"medium-6\">\n        <label for=\"address\">"
    + escapeExpression(((helpers.tr || (depth0 && depth0.tr) || helperMissing).call(depth0, "Your address", {"name":"tr","hash":{},"data":data})))
    + "</label>\n        <input type=\"text\" required name=\"address\" id=\"address\" value=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.customer : depth0)) != null ? stack1.address : stack1), depth0))
    + "\" />\n      </div>\n      <div class=\"medium-6 \">\n        <label for=\"email\">"
    + escapeExpression(((helpers.tr || (depth0 && depth0.tr) || helperMissing).call(depth0, "Email", {"name":"tr","hash":{},"data":data})))
    + "</label>\n        <input type=\"text\" required name=\"email\" id=\"email\" value=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.customer : depth0)) != null ? stack1.email : stack1), depth0))
    + "\" />\n      </div>\n      <div class=\"medium-6 \">\n        <label for=\"VAT\">"
    + escapeExpression(((helpers.tr || (depth0 && depth0.tr) || helperMissing).call(depth0, "VAT number", {"name":"tr","hash":{},"data":data})))
    + "</label>\n        <input type=\"text\" required name=\"VAT\" id=\"VAT\" value=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.customer : depth0)) != null ? stack1.VAT : stack1), depth0))
    + "\" />\n      </div>\n    </fieldset>\n  </div>\n</form>";
},"useData":true});
Handlebars.registerPartial('addons/tabs/billing-info-tab/form-panels/create/wizard', t);
return t;
});
/* END_TEMPLATE */
;
/* -------------------------------------------------------------------------- */
/* Copyright 2002-2017, OpenNebula Project, OpenNebula Systems                */
/*                                                                            */
/* Licensed under the Apache License, Version 2.0 (the "License"); you may    */
/* not use this file except in compliance with the License. You may obtain    */
/* a copy of the License at                                                   */
/*                                                                            */
/* http://www.apache.org/licenses/LICENSE-2.0                                 */
/*                                                                            */
/* Unless required by applicable law or agreed to in writing, software        */
/* distributed under the License is distributed on an "AS IS" BASIS,          */
/* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.   */
/* See the License for the specific language governing permissions and        */
/* limitations under the License.                                             */
/* -------------------------------------------------------------------------- */

define('addons/tabs/billing-info-tab/form-panels/create',['require','utils/form-panels/form-panel','sunstone','utils/locale','sunstone','utils/notifier','hbs!./create/wizard','./create/formPanelId','../tabId'],function (require) {
  /*
    DEPENDENCIES
   */

  //  require('foundation.tab');
  var BaseFormPanel = require('utils/form-panels/form-panel');
  var Sunstone = require('sunstone');
  var Locale = require('utils/locale');
  var Sunstone = require('sunstone');
  var Notifier = require('utils/notifier');

  // STRIPE


  /*
    TEMPLATES
   */

  var TemplateWizardHTML = require('hbs!./create/wizard');

  /*
    CONSTANTS
   */

  var FORM_PANEL_ID = require('./create/formPanelId');
  var TAB_ID = require('../tabId');

  /*
    CONSTRUCTOR
   */

  function FormPanel() {
    this.formPanelId = FORM_PANEL_ID;
    this.tabId = TAB_ID;
    this.actions = {
      'update': {
        'title': Locale.tr("Update Info"),
        'buttonText': Locale.tr("Update"),
        'resetButton': false
      }
    };
    BaseFormPanel.call(this);
  }

  FormPanel.FORM_PANEL_ID = FORM_PANEL_ID;
  FormPanel.prototype = Object.create(BaseFormPanel.prototype);
  FormPanel.prototype.constructor = FormPanel;
  FormPanel.prototype.htmlWizard = _htmlWizard;
  FormPanel.prototype.submitWizard = _submitWizard;
  FormPanel.prototype.onShow = _onShow;
  FormPanel.prototype.setup = _setup;

  return FormPanel;

  function _htmlWizard() {
    return TemplateWizardHTML({
      'formPanelId': this.formPanelId,
      'customer': getCustomer()
    });
  }

  function _setup(context) {
    $("#email").blur(function() {
      if(!validateEmail($("#email").val())){
        $("#email").addClass("invalid");
      } else {
        $("#email").removeClass("invalid");
      }
    });
  }

  function _submitWizard(context) {
    if (!validateEmail($("#email").val())) {
      Sunstone.hideFormPanelLoading(this.tabId);
      Notifier.notifyError("Invalid Email address");
      $("#email").addClass("invalid");
      return false;
    } else {
      customer_json = {
        'name': $("#name").val(),
        'companyName': $("#companyName").val(),
        'address': $("#address").val(),
        'email': $("#email").val(),
        'VAT': $("#VAT").val()
      }
      Sunstone.runAction("Billing-info.update", customer_json);
    }
    return false;
  }

  function _onShow(context) {
  }

  function getCustomer(context) {
    return customer = {
      'id': $("#customer-id").text(),
      'name': $("#customer-name").text(),
      'companyName': $("#customer-company-name").text(),
      'address': $("#customer-address").text(),
      'email': $("#customer-email").text(),
      'VAT': $("#customer-VAT").text()
    }
  }

  function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
});


/* START_TEMPLATE */
define('hbs!addons/tabs/billing-info-tab/panels/info/html',['hbs','hbs/handlebars','templates/helpers/tr'], function( hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  return "					<td class=\"value_td\" colspan=\"2\">YES</td>\n";
  },"3":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, buffer = "					";
  stack1 = ((helper = (helper = helpers.renameTrDefault || (depth0 != null ? depth0.renameTrDefault : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"renameTrDefault","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, lambda=this.lambda, functionType="function", buffer = "              \n\n<style>\n	.focused {\n		border: 1px solid #8a8a8a;\n		background-color: #fefefe;\n		outline: none;\n		box-shadow: 0 0 5px #cacaca;\n		transition: box-shadow 0.5s, border-color 0.25s ease-in-out;\n	}\n\n	.invalid {\n		background-color: rgba(236, 88, 64, 0.1);\n		border-color: #ec5840;\n	}\n</style>\n\n\n<div class=\"row\">\n	<div class=\"large-6 columns\">\n		<table id=\"info_zone_table\" class=\"dataTable\">\n			<thead>\n				<tr>\n					<th colspan=\"3\">"
    + escapeExpression(((helpers.tr || (depth0 && depth0.tr) || helperMissing).call(depth0, "Owner details", {"name":"tr","hash":{},"data":data})))
    + "</th>\n				</tr>\n			</thead>\n			<tbody>\n				<tr>\n					<td class=\"key_td\">"
    + escapeExpression(((helpers.tr || (depth0 && depth0.tr) || helperMissing).call(depth0, "CUSTOMER ID", {"name":"tr","hash":{},"data":data})))
    + "</td>\n					<td class=\"value_td\" colspan=\"2\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.element : depth0)) != null ? stack1.customer : stack1), depth0))
    + "</td>\n				</tr>\n				";
  stack1 = ((helper = (helper = helpers.renameTrName || (depth0 != null ? depth0.renameTrName : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"renameTrName","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  buffer += " ";
  stack1 = ((helper = (helper = helpers.renameTrEmail || (depth0 != null ? depth0.renameTrEmail : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"renameTrEmail","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  buffer += " ";
  stack1 = ((helper = (helper = helpers.renameTrAddress || (depth0 != null ? depth0.renameTrAddress : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"renameTrAddress","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  buffer += " ";
  stack1 = ((helper = (helper = helpers.renameTrAddress2 || (depth0 != null ? depth0.renameTrAddress2 : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"renameTrAddress2","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\n			</tbody>\n		</table>\n	</div>\n	<div class=\"large-6 columns\">\n		<table id=\"info_zone_table\" class=\"dataTable\">\n			<thead>\n				<tr>\n					<th colspan=\"3\">"
    + escapeExpression(((helpers.tr || (depth0 && depth0.tr) || helperMissing).call(depth0, "Card information", {"name":"tr","hash":{},"data":data})))
    + "</th>\n				</tr>\n			</thead>\n			<tbody>\n				<tr>\n					<td class=\"key_td\">"
    + escapeExpression(((helpers.tr || (depth0 && depth0.tr) || helperMissing).call(depth0, "CARD NR", {"name":"tr","hash":{},"data":data})))
    + "</td>\n					<td class=\"value_td\" colspan=\"2\">****"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.element : depth0)) != null ? stack1.last4 : stack1), depth0))
    + "</td>\n				</tr>\n				<tr>\n					";
  stack1 = ((helper = (helper = helpers.renameTrExpMonth || (depth0 != null ? depth0.renameTrExpMonth : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"renameTrExpMonth","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  buffer += " ";
  stack1 = ((helper = (helper = helpers.renameTrExpYear || (depth0 != null ? depth0.renameTrExpYear : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"renameTrExpYear","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\n				</tr>\n				<tr>\n					<td class=\"key_td\">"
    + escapeExpression(((helpers.tr || (depth0 && depth0.tr) || helperMissing).call(depth0, "BRAND", {"name":"tr","hash":{},"data":data})))
    + "</td>\n					<td class=\"value_td\" colspan=\"2\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.element : depth0)) != null ? stack1.brand : stack1), depth0))
    + "</td>\n				</tr>\n				<tr>\n					<td class=\"key_td\">"
    + escapeExpression(((helpers.tr || (depth0 && depth0.tr) || helperMissing).call(depth0, "DEFAULT", {"name":"tr","hash":{},"data":data})))
    + "</td>\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.isDefault : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.program(3, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "				</tr>\n			</tbody>\n		</table>\n	</div>\n	<div class=\"large-12 columns\">\n		<table id=\"info_zone_table\" class=\"dataTable\">\n			<thead>\n				<tr>\n					<th colspan=\"3\">"
    + escapeExpression(((helpers.tr || (depth0 && depth0.tr) || helperMissing).call(depth0, "Company information", {"name":"tr","hash":{},"data":data})))
    + "</th>\n				</tr>\n			</thead>\n			<tbody>\n				";
  stack1 = ((helper = (helper = helpers.renameTrCompanyName || (depth0 != null ? depth0.renameTrCompanyName : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"renameTrCompanyName","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  buffer += " ";
  stack1 = ((helper = (helper = helpers.renameTrVAT || (depth0 != null ? depth0.renameTrVAT : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"renameTrVAT","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  buffer += " ";
  stack1 = ((helper = (helper = helpers.renameTrCIF || (depth0 != null ? depth0.renameTrCIF : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"renameTrCIF","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n			</tbody>\n		</table>\n	</div>\n</div>";
},"useData":true});
Handlebars.registerPartial('addons/tabs/billing-info-tab/panels/info/html', t);
return t;
});
/* END_TEMPLATE */
;
/* -------------------------------------------------------------------------- */
/* Copyright 2002-2017, OpenNebula Project, OpenNebula Systems                */
/*                                                                            */
/* Licensed under the Apache License, Version 2.0 (the "License"); you may    */
/* not use this file except in compliance with the License. You may obtain    */
/* a copy of the License at                                                   */
/*                                                                            */
/* http://www.apache.org/licenses/LICENSE-2.0                                 */
/*                                                                            */
/* Unless required by applicable law or agreed to in writing, software        */
/* distributed under the License is distributed on an "AS IS" BASIS,          */
/* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.   */
/* See the License for the specific language governing permissions and        */
/* limitations under the License.                                             */
/* -------------------------------------------------------------------------- */

define('addons/tabs/billing-info-tab/panels/info/panelId',['require'],function (require) {
  return 'billing_info_info_tab';
});
define('addons/tabs/billing-info-tab/panels/info',['require','hbs!./info/html','utils/locale','../../utils/fields-tr','utils/locale','../tabId','./info/panelId'],function (require) {
	/*
		DEPENDENCIES
	 */


	var TemplateInfo = require('hbs!./info/html');
	var Locale = require('utils/locale');
	var RenameTr = require('../../utils/fields-tr');


	/*
		CONSTANTS
	 */
	var Locale = require('utils/locale');
	var TAB_ID = require('../tabId');
	var PANEL_ID = require('./info/panelId');
	var RESOURCE = "Payments"

	/*
		CONSTRUCTOR
	 */

	function Panel(info) {
		this.title = Locale.tr("Info");
		this.icon = "fa-info-circle";
		this.tabId = TAB_ID;
		this.element = info;

		return this;
	};

	Panel.PANEL_ID = PANEL_ID;
	Panel.prototype.html = _html;
	Panel.prototype.setup = _setup;

	return Panel;


	function _html() {
	}

	function _setup(context) {
		RenameTr.setup(TAB_ID, RESOURCE, this.element.id, context);
		return false;
	}
});

/* -------------------------------------------------------------------------- */
/* Copyright 2002-2017, OpenNebula Project, OpenNebula Systems                */
/*                                                                            */
/* Licensed under the Apache License, Version 2.0 (the "License"); you may    */
/* not use this file except in compliance with the License. You may obtain    */
/* a copy of the License at                                                   */
/*                                                                            */
/* http://www.apache.org/licenses/LICENSE-2.0                                 */
/*                                                                            */
/* Unless required by applicable law or agreed to in writing, software        */
/* distributed under the License is distributed on an "AS IS" BASIS,          */
/* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.   */
/* See the License for the specific language governing permissions and        */
/* limitations under the License.                                             */
/* -------------------------------------------------------------------------- */

define('addons/tabs/billing-info-tab',['require','utils/locale','./billing-info-tab/actions','./billing-info-tab/buttons','./billing-info-tab/tabId','hbs!./billing-info-tab/utils/wizard','./billing-info-tab/form-panels/create','./billing-info-tab/panels/info'],function (require) {
  var Locale = require('utils/locale');
  var _actions = require('./billing-info-tab/actions');
  var _buttons = require('./billing-info-tab/buttons');
  var TAB_ID = require('./billing-info-tab/tabId');
  var HTMLTemplate = require("hbs!./billing-info-tab/utils/wizard")
  //var GenerateHTML = require('.billing-info-tab/utils');

  var _formPanels = [
    require('./billing-info-tab/form-panels/create')
  ];

  var _panels = [
    require('./billing-info-tab/panels/info'),
  ];

  var Tab = {
    tabId: TAB_ID,
    title: Locale.tr("Profile"),
    icon: 'fa-user-circle',
    tabClass: "subTab",
    content: HTMLTemplate,
    parentTab: "billing-top-tab",
    listHeader: Locale.tr("User Profile"),
    resource: 'Billing-info',
    buttons: _buttons,
    actions: _actions,
    formPanels: _formPanels,
    panels: _panels
  };

  return Tab;
});

/* -------------------------------------------------------------------------- */
/* Copyright 2002-2017, OpenNebula Project, OpenNebula Systems                */
/*                                                                            */
/* Licensed under the Apache License, Version 2.0 (the "License"); you may    */
/* not use this file except in compliance with the License. You may obtain    */
/* a copy of the License at                                                   */
/*                                                                            */
/* http://www.apache.org/licenses/LICENSE-2.0                                 */
/*                                                                            */
/* Unless required by applicable law or agreed to in writing, software        */
/* distributed under the License is distributed on an "AS IS" BASIS,          */
/* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.   */
/* See the License for the specific language governing permissions and        */
/* limitations under the License.                                             */
/* -------------------------------------------------------------------------- */

define('addons/tabs/invoices-tab/tabId',['require'],function(require){
    return 'invoices-tab';
  });
/* -------------------------------------------------------------------------- */
/* Copyright 2002-2017, OpenNebula Project, OpenNebula Systems                */
/*                                                                            */
/* Licensed under the Apache License, Version 2.0 (the "License"); you may    */
/* not use this file except in compliance with the License. You may obtain    */
/* a copy of the License at                                                   */
/*                                                                            */
/* http://www.apache.org/licenses/LICENSE-2.0                                 */
/*                                                                            */
/* Unless required by applicable law or agreed to in writing, software        */
/* distributed under the License is distributed on an "AS IS" BASIS,          */
/* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.   */
/* See the License for the specific language governing permissions and        */
/* limitations under the License.                                             */
/* -------------------------------------------------------------------------- */

define('addons/tabs/invoices-tab/actions',['require','utils/notifier','utils/locale','./tabId','sunstone'],function (require) {

  var Notifier = require('utils/notifier');
  var Locale = require('utils/locale');
  var TAB_ID = require('./tabId');
  var Sunstone = require('sunstone');
  var PATH = 'billing/invoices';

  var _actions = {
    "Invoices.list": {
      type: "list",
      call: function (params) {
        type: "list",
          $.ajax({
            url: PATH,
            type: "GET",
            dataType: "json",
            success: function (response, request) {
              var datatable = Sunstone.getDataTable(TAB_ID);
              if (datatable) {
                datatable.updateView(request, response);
              }
            },
            error: function (response) {
            }
          });
      }
    },
    "Invoices.refresh": {
      type: "list",
      call: function (params) {
        type: "list",
          $.ajax({
            url: PATH,
            type: "GET",
            dataType: "json",
            success: function (response, request) {
              var datatable = Sunstone.getDataTable(TAB_ID);
              if (datatable) {
                datatable.updateView(request, response);
              }
            },
            error: function (response) {
            }
          });
      }
    },

    "Invoices.show": {
      type: "single",
      call: function (params) {
        $.ajax({
          url: PATH + "/" + params.data.id,
          type: "GET",
          dataType: "json",
          data: params.data,
          success: function (response) {
            if (Sunstone.rightInfoVisible($('#' + TAB_ID))) {
              Sunstone.insertPanels(TAB_ID, response);
            }
          },
          error: function (request, response) {
            console.log("error show", response, request);
          }
        });
      }
    },


    "Invoices.pdf": {
      type: "single",
      call: function () {
        var doc = new jsPDF();
				doc.text('Hello world!', 10, 10);
				doc.save('a4.pdf');
      }
    },
  };

  return _actions;
});
/* -------------------------------------------------------------------------- */
/* Copyright 2002-2017, OpenNebula Project, OpenNebula Systems                */
/*                                                                            */
/* Licensed under the Apache License, Version 2.0 (the "License"); you may    */
/* not use this file except in compliance with the License. You may obtain    */
/* a copy of the License at                                                   */
/*                                                                            */
/* http://www.apache.org/licenses/LICENSE-2.0                                 */
/*                                                                            */
/* Unless required by applicable law or agreed to in writing, software        */
/* distributed under the License is distributed on an "AS IS" BASIS,          */
/* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.   */
/* See the License for the specific language governing permissions and        */
/* limitations under the License.                                             */
/* -------------------------------------------------------------------------- */

define('addons/tabs/invoices-tab/buttons',['require','utils/locale'],function(require) {
    var Locale = require('utils/locale');

    var Buttons = {
      "Invoices.refresh" : {
        type: "action",
        layout: "refresh",
        alwaysActive: true
      },

      "Invoices.pdf": {
        type: "action",
        layout: "main",
        text: '<i class="fas fa-file-pdf"/>' + Locale.tr("\  PDF"),
        custom_classes: "only-sunstone-info"
      }
    };

    return Buttons;
  })
;

/* START_TEMPLATE */
define('hbs!addons/tabs/invoices-tab/datatable/search',['hbs','hbs/handlebars','templates/helpers/tr'], function( hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, functionType="function";
  return "<div class=\"row\">\n  <div class=\"small-12 columns\">\n    <label>\n      "
    + escapeExpression(((helpers.tr || (depth0 && depth0.tr) || helperMissing).call(depth0, "Date", {"name":"tr","hash":{},"data":data})))
    + "\n      <input search-field=\"DATE\" type=\"text\" list=\""
    + escapeExpression(((helper = (helper = helpers.tableId || (depth0 != null ? depth0.tableId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"tableId","hash":{},"data":data}) : helper)))
    + "-searchListDATE\"/>\n      <datalist search-datalist=\"DATE\" id=\""
    + escapeExpression(((helper = (helper = helpers.tableId || (depth0 != null ? depth0.tableId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"tableId","hash":{},"data":data}) : helper)))
    + "-searchListDATE\">\n      </datalist>\n    </label>\n    <label>\n      "
    + escapeExpression(((helpers.tr || (depth0 && depth0.tr) || helperMissing).call(depth0, "Description", {"name":"tr","hash":{},"data":data})))
    + "\n      <input search-field=\"DESCRIPTION\" type=\"text\" list=\""
    + escapeExpression(((helper = (helper = helpers.tableId || (depth0 != null ? depth0.tableId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"tableId","hash":{},"data":data}) : helper)))
    + "-searchListDESCRIPTION\"/>\n      <datalist search-datalist=\"DESCRIPTION\" id=\""
    + escapeExpression(((helper = (helper = helpers.tableId || (depth0 != null ? depth0.tableId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"tableId","hash":{},"data":data}) : helper)))
    + "-searchListDESCRIPTION\">\n      </datalist>\n    </label>\n    <label>\n      "
    + escapeExpression(((helpers.tr || (depth0 && depth0.tr) || helperMissing).call(depth0, "Amount", {"name":"tr","hash":{},"data":data})))
    + "\n      <input search-field=\"AMOUNT\" type=\"text\" list=\""
    + escapeExpression(((helper = (helper = helpers.tableId || (depth0 != null ? depth0.tableId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"tableId","hash":{},"data":data}) : helper)))
    + "-searchListAMOUNT\"/>\n      <datalist search-datalist=\"AMOUNT\" id=\""
    + escapeExpression(((helper = (helper = helpers.tableId || (depth0 != null ? depth0.tableId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"tableId","hash":{},"data":data}) : helper)))
    + "-searchListAMOUNT\">\n      </datalist>\n    </label>\n  </div>\n</div>";
},"useData":true});
Handlebars.registerPartial('addons/tabs/invoices-tab/datatable/search', t);
return t;
});
/* END_TEMPLATE */
;
/* -------------------------------------------------------------------------- */
/* Copyright 2002-2017, OpenNebula Project, OpenNebula Systems                */
/*                                                                            */
/* Licensed under the Apache License, Version 2.0 (the "License"); you may    */
/* not use this file except in compliance with the License. You may obtain    */
/* a copy of the License at                                                   */
/*                                                                            */
/* http://www.apache.org/licenses/LICENSE-2.0                                 */
/*                                                                            */
/* Unless required by applicable law or agreed to in writing, software        */
/* distributed under the License is distributed on an "AS IS" BASIS,          */
/* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.   */
/* See the License for the specific language governing permissions and        */
/* limitations under the License.                                             */
/* -------------------------------------------------------------------------- */

define('addons/tabs/invoices-tab/datatable',['require','utils/tab-datatable','sunstone-config','utils/locale','hbs!./datatable/search','utils/status','./tabId'],function (require) {
  /*
    DEPENDENCIES
   */

  var TabDataTable = require('utils/tab-datatable');
  var SunstoneConfig = require('sunstone-config');
  var Locale = require('utils/locale');
  var SearchDropdown = require('hbs!./datatable/search');
  var Status = require('utils/status');

  /*
    CONSTANTS
   */

  var RESOURCE = "Invoices";
  var TAB_NAME = require('./tabId');
  var LABELS_COLUMN = 3;

  /*
    CONSTRUCTOR
   */

  function Table(dataTableId, conf) {
    this.conf = conf || {};
    this.tabId = TAB_NAME;
    this.dataTableId = dataTableId;
    this.resource = RESOURCE;
    this.labelsColumn = LABELS_COLUMN;

    this.dataTableOptions = {
      "bAutoWidth": false,
      "bSortClasses": false,
      "bDeferRender": true,
      "aoColumnDefs": [
        { "bVisible": false, "aTargets": [0]},
        { "sWidth": "33%", "aTargets": [1,2,3]},
        { "bVisible": true, "aTargets": SunstoneConfig.tabTableColumns(TAB_NAME) },
        { "sType": "text", "aTargets": [1,2,3]}
      ]
    };

    this.columns = [
      Locale.tr("Description"),
      Locale.tr("Amount"),
      Locale.tr("Date")
    ];

    this.selectOptions = {
      "id_index": 1,
      "name_index": 1,
      "select_resource": Locale.tr("Please select a invoice from the list"),
      "you_selected": Locale.tr("You selected the following invoice:"),
      "select_resource_multiple": Locale.tr("Please select one or more invoices from the list"),
      "you_selected_multiple": Locale.tr("You selected the following invoices:")
    };

    this.totalInvoices= 0;

    this.conf.searchDropdownHTML = SearchDropdown({ tableId: this.dataTableId });

    TabDataTable.call(this);
  }

  Table.prototype = Object.create(TabDataTable.prototype);
  Table.prototype.constructor = Table;
  Table.prototype.elementArray = _elementArray;
  Table.prototype.preUpdateView = _preUpdateView;
  Table.prototype.postUpdateView = _postUpdateView;

  return Table;

  /*
    FUNCTION DEFINITIONS
   */

  function _elementArray(element) {
    invoice = element.lines.data.pop();
    this.totalInvoices++;
    date = new Date (invoice.period.start*1000);
    dateStr = date.getDate() + "-" + (date.getMonth()+1) + "-" + date.getFullYear();
    cust_amount = (invoice.amount/100).toFixed(2) + " " + invoice.currency.toUpperCase();


    var search = {
      DATE: dateStr,
      DESCRIPTION: invoice.description,
      AMOUNT: invoice.amount
    }

    var color_html = Status.state_lock_to_color(RESOURCE, false, undefined);

    return [
      '<input class="check_item" type="checkbox" id="' + RESOURCE.toLowerCase() + '_' +
      element.id + '" name="selected_items" ' +
      'value="' + element.id + '"/>' + color_html,
      invoice.description,
      cust_amount,
      dateStr,

      btoa(unescape(encodeURIComponent(JSON.stringify(search))))
    ];
  }

  function _preUpdateView() {
    this.totalInvoices = 0;
  }

  function _postUpdateView() {
    $(".total_invoice").text(this.totalInvoices);
  }
});

/* START_TEMPLATE */
define('hbs!addons/tabs/invoices-tab/panels/info/html',['hbs','hbs/handlebars','templates/helpers/tr'], function( hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, lambda=this.lambda, functionType="function", buffer = "              \n\n<style>\n	.focused {\n		border: 1px solid #8a8a8a;\n		background-color: #fefefe;\n		outline: none;\n		box-shadow: 0 0 5px #cacaca;\n		transition: box-shadow 0.5s, border-color 0.25s ease-in-out;\n	}\n\n	.invalid {\n		background-color: rgba(236, 88, 64, 0.1);\n		border-color: #ec5840;\n	}\n</style>\n\n\n<div class=\"row\">\n	<div class=\"large-6 columns\">\n		<table id=\"info_zone_table\" class=\"dataTable\">\n			<thead>\n				<tr>\n					<th colspan=\"3\">"
    + escapeExpression(((helpers.tr || (depth0 && depth0.tr) || helperMissing).call(depth0, "Invoice information", {"name":"tr","hash":{},"data":data})))
    + "</th>\n				</tr>\n			</thead>\n			<tbody>\n				<tr>\n					<td class=\"key_td\">"
    + escapeExpression(((helpers.tr || (depth0 && depth0.tr) || helperMissing).call(depth0, "Invoice nº", {"name":"tr","hash":{},"data":data})))
    + "</td>\n					<td class=\"value_td\" colspan=\"2\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.invoice : depth0)) != null ? stack1.number : stack1), depth0))
    + "</td>\n				</tr>\n				<tr>\n					<td class=\"key_td\">"
    + escapeExpression(((helpers.tr || (depth0 && depth0.tr) || helperMissing).call(depth0, "Description", {"name":"tr","hash":{},"data":data})))
    + "</td>\n					<td class=\"value_td\" colspan=\"2\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.invoice : depth0)) != null ? stack1.description : stack1), depth0))
    + "</td>\n				</tr>\n				<tr>\n					<td class=\"key_td\">"
    + escapeExpression(((helpers.tr || (depth0 && depth0.tr) || helperMissing).call(depth0, "Start", {"name":"tr","hash":{},"data":data})))
    + "</td>\n					<td class=\"value_td\" colspan=\"2\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.invoice : depth0)) != null ? stack1.period_start : stack1), depth0))
    + "</td>\n				</tr>\n				<tr>\n					<td class=\"key_td\">"
    + escapeExpression(((helpers.tr || (depth0 && depth0.tr) || helperMissing).call(depth0, "End", {"name":"tr","hash":{},"data":data})))
    + "</td>\n					<td class=\"value_td\" colspan=\"2\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.invoice : depth0)) != null ? stack1.period_end : stack1), depth0))
    + "</td>\n				</tr>\n			</tbody>\n		</table>\n	</div>\n	<div class=\"large-6 columns\">\n		<table id=\"info_zone_table\" class=\"dataTable\">\n			<thead>\n				<tr>\n					<th colspan=\"3\">"
    + escapeExpression(((helpers.tr || (depth0 && depth0.tr) || helperMissing).call(depth0, "Bill to", {"name":"tr","hash":{},"data":data})))
    + "</th>\n				</tr>\n			</thead>\n			<tbody>\n				<tr>\n					<td class=\"key_td\">"
    + escapeExpression(((helpers.tr || (depth0 && depth0.tr) || helperMissing).call(depth0, "Company name", {"name":"tr","hash":{},"data":data})))
    + "</td>\n					<td class=\"value_td\" colspan=\"2\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.invoice : depth0)) != null ? stack1.companyName : stack1), depth0))
    + "</td>\n				</tr>\n				<tr>\n					<td class=\"key_td\">"
    + escapeExpression(((helpers.tr || (depth0 && depth0.tr) || helperMissing).call(depth0, "Address", {"name":"tr","hash":{},"data":data})))
    + "</td>\n					<td class=\"value_td\" colspan=\"2\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.invoice : depth0)) != null ? stack1.address : stack1), depth0))
    + "</td>\n				</tr>\n				<tr>\n					<td class=\"key_td\">"
    + escapeExpression(((helpers.tr || (depth0 && depth0.tr) || helperMissing).call(depth0, "Email", {"name":"tr","hash":{},"data":data})))
    + "</td>\n					<td class=\"value_td\" colspan=\"2\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.invoice : depth0)) != null ? stack1.email : stack1), depth0))
    + "</td>\n				</tr>\n				<tr>\n					<td class=\"key_td\">"
    + escapeExpression(((helpers.tr || (depth0 && depth0.tr) || helperMissing).call(depth0, "VAT nº", {"name":"tr","hash":{},"data":data})))
    + "</td>\n					<td class=\"value_td\" colspan=\"2\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.invoice : depth0)) != null ? stack1.VAT : stack1), depth0))
    + "</td>\n				</tr>\n			</tbody>\n		</table>\n	</div>\n	<div class=\"large-6 columns\">\n		<table id=\"info_zone_table\" class=\"dataTable\">\n			<thead>\n				<tr>\n					<th colspan=\"3\">"
    + escapeExpression(((helpers.tr || (depth0 && depth0.tr) || helperMissing).call(depth0, "Amount", {"name":"tr","hash":{},"data":data})))
    + "</th>\n				</tr>\n			</thead>\n			<tbody>\n				<tr>\n					<td class=\"key_td\">"
    + escapeExpression(((helpers.tr || (depth0 && depth0.tr) || helperMissing).call(depth0, "TOTAL: ", {"name":"tr","hash":{},"data":data})))
    + "</td>\n					<td class=\"value_td\" colspan=\"2\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.invoice : depth0)) != null ? stack1.amount : stack1), depth0))
    + "</td>\n				</tr>\n			</tbody>\n		</table>\n	</div>\n	<div class=\"large-6 columns\"></div>\n	<div class=\"large-12 columns\">\n		";
  stack1 = ((helper = (helper = helpers.showback || (depth0 != null ? depth0.showback : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"showback","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n	</div>\n</div>";
},"useData":true});
Handlebars.registerPartial('addons/tabs/invoices-tab/panels/info/html', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
define('hbs!addons/tabs/utils/showback/html',['hbs','hbs/handlebars','templates/helpers/tr'], function( hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "\n<div id=\"showback_placeholder\">\n  <div class=\"row\">\n    <div class=\"large-8 large-centered columns\">\n      <div class=\"text-center\">\n        <span class=\"fa-stack fa-5x\" style=\"color: #dfdfdf\">\n          <i class=\"fas fa-cloud fa-stack-2x\"></i>\n          <i class=\"fas fa-money-bill-alt fa-stack-1x fa-inverse\"></i>\n        </span>\n        <div id=\"showback_no_data\" hidden>\n          <br>\n          <p style=\"font-size: 18px; color: #999\">\n            "
    + escapeExpression(((helpers.tr || (depth0 && depth0.tr) || helperMissing).call(depth0, "There are no showback records", {"name":"tr","hash":{},"data":data})))
    + "\n          </p>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n  <div id=\"showback_content\" hidden>\n    <div class=\"row showback_vms_table\" hidden>\n      <div class=\"large-12 columns graph_legend\">\n        <h3 class=\"subheader\" id=\"showback_vms_title\">"
    + escapeExpression(((helpers.tr || (depth0 && depth0.tr) || helperMissing).call(depth0, "VMs", {"name":"tr","hash":{},"data":data})))
    + "</h3>\n      </div>\n      <div class=\"large-12 columns\" style=\"overflow:auto\">\n        <table id=\"showback_vms_datatable\" class=\"datatable twelve\">\n          <thead>\n            <tr>\n              <th>"
    + escapeExpression(((helpers.tr || (depth0 && depth0.tr) || helperMissing).call(depth0, "ID", {"name":"tr","hash":{},"data":data})))
    + "</th>\n              <th>"
    + escapeExpression(((helpers.tr || (depth0 && depth0.tr) || helperMissing).call(depth0, "Name", {"name":"tr","hash":{},"data":data})))
    + "</th>\n              <th>"
    + escapeExpression(((helpers.tr || (depth0 && depth0.tr) || helperMissing).call(depth0, "Owner", {"name":"tr","hash":{},"data":data})))
    + "</th>\n              <th>"
    + escapeExpression(((helpers.tr || (depth0 && depth0.tr) || helperMissing).call(depth0, "Hours", {"name":"tr","hash":{},"data":data})))
    + "</th>\n              <th>"
    + escapeExpression(((helpers.tr || (depth0 && depth0.tr) || helperMissing).call(depth0, "Cost", {"name":"tr","hash":{},"data":data})))
    + "</th>\n            </tr>\n          </thead>\n          <tbody id=\"tbody_showback_datatable\">\n          </tbody>\n        </table>\n      </div>\n    </div>\n  </div>\n";
},"useData":true});
Handlebars.registerPartial('addons/tabs/utils/showback/html', t);
return t;
});
/* END_TEMPLATE */
;
/* -------------------------------------------------------------------------- */
/* Copyright 2002-2018, OpenNebula Project, OpenNebula Systems                */
/*                                                                            */
/* Licensed under the Apache License, Version 2.0 (the "License"); you may    */
/* not use this file except in compliance with the License. You may obtain    */
/* a copy of the License at                                                   */
/*                                                                            */
/* http://www.apache.org/licenses/LICENSE-2.0                                 */
/*                                                                            */
/* Unless required by applicable law or agreed to in writing, software        */
/* distributed under the License is distributed on an "AS IS" BASIS,          */
/* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.   */
/* See the License for the specific language governing permissions and        */
/* limitations under the License.                                             */
/* -------------------------------------------------------------------------- */

define('addons/tabs/utils/showback',['require','hbs!./showback/html','utils/locale','opennebula/vm','utils/notifier','utils/resource-select','flot','flot.stack','flot.resize','flot.tooltip','flot.time'],function (require) {

	var TemplateHTML = require('hbs!./showback/html');
	var Locale = require('utils/locale');
	var OpenNebulaVM = require('opennebula/vm');
	var Notifier = require('utils/notifier');
	var ResourceSelect = require('utils/resource-select');

	require('flot');
	require('flot.stack');
	require('flot.resize');
	require('flot.tooltip');
	require('flot.time');

	function _html() {
		var html = TemplateHTML({});

		return html;
	}

	// context is a jQuery selector
	// The following options can be set:
	//   fixed_user     fix an owner user ID. Use "" to fix to "any user"
	//   fixed_group    fix an owner group ID. Use "" to fix to "any group"
	function _setup(context, opt) {

		if (opt == undefined) {
			opt = {};
		}
		this.options = opt;
		this.year = this.options.start_year;
		this.month = this.options.start_month;
		OpenNebulaVM.showback({
			// timeout: true,

			success: function (req, response) {
				_fillShowback(context, req, response);
			},
			error: Notifier.onError,
			data: opt
		});

		//--------------------------------------------------------------------------
		// VM owner: all, group, user
		//--------------------------------------------------------------------------

		showback_vms_dataTable = $("#showback_vms_datatable", context).dataTable({
			"bSortClasses": false,
			"bDeferRender": true,
			"aoColumnDefs": [
				{ "sType": "num", "aTargets": [0, 3, 4] }
			]
		});
		showback_vms_dataTable.fnClearTable();
	
		$("#showback_vms_title", context).text(
			Locale.months[this.month -1 ] + " " + this.year + " " + Locale.tr("VMs"));
		$(".showback_vms_table", context).show();
		$(".showback_select_a_row", context).hide();
	}

	function _fillShowback(context, req, response) {
		$("#showback_no_data", context).hide();

		if (response.SHOWBACK_RECORDS == undefined) {
			$("#showback_placeholder", context).show();
			$("#showback_content", context).hide();

			$("#showback_no_data", context).show();
			return false;
		}

		

		var vms_per_date = {};
    $.each(response.SHOWBACK_RECORDS.SHOWBACK, function(index, showback){
      if (vms_per_date[showback.YEAR] == undefined) {
        vms_per_date[showback.YEAR] = {};
      }

      if (vms_per_date[showback.YEAR][showback.MONTH] == undefined) {
        vms_per_date[showback.YEAR][showback.MONTH] = {
          "VMS": [],
          "TOTAL": 0
        };
      }

      vms_per_date[showback.YEAR][showback.MONTH].VMS.push(
        [ showback.VMID,
          showback.VMNAME,
          showback.UNAME,
          showback.HOURS,
          showback.TOTAL_COST
        ]);

      vms_per_date[showback.YEAR][showback.MONTH].TOTAL += parseFloat(showback.TOTAL_COST);
		});
		showback_vms_dataTable.fnAddData(vms_per_date[this.year][this.month].VMS);
		$("#showback_placeholder", context).hide();
		$("#showback_content", context).show();
	}

	return {
		'html': _html,
		'setup': _setup
	};
});

/* -------------------------------------------------------------------------- */
/* Copyright 2002-2017, OpenNebula Project, OpenNebula Systems                */
/*                                                                            */
/* Licensed under the Apache License, Version 2.0 (the "License"); you may    */
/* not use this file except in compliance with the License. You may obtain    */
/* a copy of the License at                                                   */
/*                                                                            */
/* http://www.apache.org/licenses/LICENSE-2.0                                 */
/*                                                                            */
/* Unless required by applicable law or agreed to in writing, software        */
/* distributed under the License is distributed on an "AS IS" BASIS,          */
/* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.   */
/* See the License for the specific language governing permissions and        */
/* limitations under the License.                                             */
/* -------------------------------------------------------------------------- */

define('addons/tabs/invoices-tab/panels/info/panelId',['require'],function (require) {
  return 'invoice_info_tab';
});
define('addons/tabs/invoices-tab/panels/info',['require','hbs!./info/html','utils/locale','../../utils/fields-tr','hbs!../../utils/showback/html','../../utils/showback','utils/locale','../tabId','./info/panelId','sunstone'],function (require) {
	/*
		DEPENDENCIES
	 */


	var TemplateInfo = require('hbs!./info/html');
	var Locale = require('utils/locale');
	var RenameTr = require('../../utils/fields-tr');
	var TemplateHTML = require('hbs!../../utils/showback/html');

	var Showback = require('../../utils/showback');


	/*
		CONSTANTS
	 */
	var Locale = require('utils/locale');
	var TAB_ID = require('../tabId');
	var PANEL_ID = require('./info/panelId');
	var Sunstone = require('sunstone');
	/*
		CONSTRUCTOR
	 */

	function Panel(info) {
		//recieve card + invoice in json
		this.title = Locale.tr("Info");
		this.icon = "fa-info-circle";
		this.tabId = TAB_ID;
		this.element = info;

		return this;
	};

	Panel.PANEL_ID = PANEL_ID;
	Panel.prototype.html = _html;
	Panel.prototype.setup = _setup;

	return Panel;


	function _html() {
		return TemplateInfo({
			'invoice': this.element,
			'showback': TemplateHTML
		});
	}


	function _setup(context) {

		month = new Date(this.element.period_start).getMonth() + 1;
		//end_m = new Date(this.element.period_end).getMonth();

		year = new Date(this.element.period_start).getFullYear();
		var opt = {
			userfilter: -3,
			start_month: month,
			end_month: month,
			start_year: year,
			end_year: year
		}
		Showback.setup(
			context,
			opt
		);
		return false;

	}
});

/* -------------------------------------------------------------------------- */
/* Copyright 2002-2017, OpenNebula Project, OpenNebula Systems                */
/*                                                                            */
/* Licensed under the Apache License, Version 2.0 (the "License"); you may    */
/* not use this file except in compliance with the License. You may obtain    */
/* a copy of the License at                                                   */
/*                                                                            */
/* http://www.apache.org/licenses/LICENSE-2.0                                 */
/*                                                                            */
/* Unless required by applicable law or agreed to in writing, software        */
/* distributed under the License is distributed on an "AS IS" BASIS,          */
/* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.   */
/* See the License for the specific language governing permissions and        */
/* limitations under the License.                                             */
/* -------------------------------------------------------------------------- */

define('addons/tabs/invoices-tab',['require','utils/locale','./invoices-tab/actions','./invoices-tab/buttons','./invoices-tab/tabId','./invoices-tab/datatable','./invoices-tab/panels/info'],function (require) {
  var Locale = require('utils/locale');
  var _actions = require('./invoices-tab/actions');
  var _buttons = require('./invoices-tab/buttons');
  var TAB_ID = require('./invoices-tab/tabId');
  var Table = require('./invoices-tab/datatable');

  var DATATABLE_ID = "dataTableInvoice";

  var _panels = [
    require('./invoices-tab/panels/info'),
  ];

  var Tab = {
    tabId: TAB_ID,
    title: Locale.tr("Invoice"),
    icon: 'fa-book',
    tabClass: "subTab",
    parentTab: "billing-top-tab",
    listHeader: Locale.tr("Invoice"),
    infoHeader: Locale.tr("Cards"),
    subheader: '<span>\
          <span class="total_invoice"/> <small>'+ Locale.tr("TOTAL") + '</small>\
        </span>',
    resource: 'Invoices',
    buttons: _buttons,
    actions: _actions,
    dataTable: new Table(DATATABLE_ID, { actions: true, info: true }),
    panels: _panels
  };

  return Tab;
});

// list-start //
        'addons/tabs/payments-tab',
        'addons/tabs/billing-top-tab',
        'addons/tabs/billing-info-tab',
        'addons/tabs/invoices-tab',
